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
            # TODO: these are IDs. Send them as driver_id, passenger_id to make it clearer in the front
            "passenger",
            "driver",
        )

class UserUpdateSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(required=False)
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    class Meta:
        model = User
        fields = ['first_name','last_name','photo']

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


class PreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields=("preference_0", "preference_1", "preference_2", "preference_3")
