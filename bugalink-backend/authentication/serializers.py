from allauth.account.utils import setup_user_email
from dj_rest_auth.registration.serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers

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
