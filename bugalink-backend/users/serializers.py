from rest_framework import serializers

from drivers.models import Driver
from passengers.models import Passenger
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
            # TODO: these are IDs. Send them as driver_id, passenger_id to make it clearer in the front
            "passenger",
            "driver",
        )


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
        fields = ("user",)
