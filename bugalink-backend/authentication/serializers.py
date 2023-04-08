from allauth.account.utils import setup_user_email
from dj_rest_auth.registration.serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from passengers.models import Passenger


# https://dj-rest-auth.readthedocs.io/en/latest/configuration.html#register-serializer
class CustomRegisterSerializer(RegisterSerializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    def get_cleaned_data(self):
        super().get_cleaned_data()
        return {
            "first_name": self.validated_data.get("first_name", ""),
            "last_name": self.validated_data.get("last_name", ""),
            "email": self.validated_data.get("email", ""),
            "password1": self.validated_data.get("password1", ""),
            "password2": self.validated_data.get("password2", ""),
        }

    @transaction.atomic
    def save(self, request):
        user = get_user_model()()
        self.cleaned_data = self.get_cleaned_data()
        user.email = self.cleaned_data["email"]
        user.first_name = self.cleaned_data["first_name"]
        user.last_name = self.cleaned_data["last_name"]
        # Add more custom fields here as needed
        # user.username = user.email
        user.set_password(self.cleaned_data["password1"])
        user.save()

        passenger = Passenger.objects.create(user=user)
        passenger.routines.set([])
        passenger.save()

        user.passenger = passenger
        setup_user_email(request, user, [])
        return user


# https://medium.com/django-rest/django-rest-framework-jwt-authentication-94bee36f2af8
class EnrichedTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super(EnrichedTokenObtainPairSerializer, cls).get_token(user)

        # Add custom claims
        # NOTE: we add more data to the JWT so that we can use it in the frontend
        # Without retrieving driver, passenger and user IDs all the time
        token["user_id"] = user.id
        token["passenger_id"] = user.passenger.id
        token["driver_id"] = user.driver.id if user.is_driver else None
        token["first_name"] = user.first_name
        token["last_name"] = user.last_name
        token["photo"] = user.photo.url if user.photo else None
        token["verified"] = user.verified
        token["driver_verified"] = user.is_verified_driver
        return token
