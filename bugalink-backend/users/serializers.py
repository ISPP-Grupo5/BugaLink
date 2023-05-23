import os

from django.db.models import Avg
from django.utils import timezone
from drivers.models import Driver
from passengers.models import Passenger
from ratings.models import DriverRating
from rest_framework import serializers
from trips.models import Trip, TripRequest
from users.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # NOTE: Add more fields as needed in the JSON response
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "photo",
            "date_joined",
            "passenger",
            "driver",
        )

    def to_representation(self, instance):
        backend_url = os.environ.get("BACKEND_URL", "http://localhost:8000")
        ret = super().to_representation(instance)
        ret["photo"] = backend_url + instance.photo.url if instance.photo else None
        return ret


class UserUpdateSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(required=False)
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ["first_name", "last_name", "photo"]


# Given a passenger, return its user object
class PassengerAsUserSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Passenger
        fields = ("user",)


class DriverAsUserSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Driver
        fields = ("id", "user")


class UserRatingSerializer(serializers.ModelSerializer):
    rating = serializers.SerializerMethodField()
    number_ratings = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["pk", "number_ratings", "rating"]

    def get_rating(self, obj) -> serializers.FloatField:
        avg_rating = (
            DriverRating.objects.filter(
                trip_request__trip__driver_routine__driver__user=obj
            )
            .aggregate(Avg("rating"))
            .get("rating__avg")
        )

        return avg_rating if avg_rating is not None else 0.0

    def get_number_ratings(self, obj) -> serializers.IntegerField:
        count = DriverRating.objects.filter(
            trip_request__trip__driver_routine__driver__user=obj
        ).count()
        return count


class UserStatsSerializer(UserRatingSerializer):
    total_rides = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "photo",
            "total_rides",
            "number_ratings",
            "rating",
        ]

    def get_total_rides(self, obj) -> serializers.IntegerField:
        trips_requests_where_user_is_passenger = TripRequest.objects.filter(
            passenger__user=obj,
            status="ACCEPTED",
            trip__departure_datetime__lt=timezone.now(),
        ).count()
        trips_where_user_is_driver = Trip.objects.filter(
            driver_routine__driver__user=obj, departure_datetime__lt=timezone.now()
        ).count()
        total_rides = (
            trips_where_user_is_driver + trips_requests_where_user_is_passenger
        )
        return total_rides
