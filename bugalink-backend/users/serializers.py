from trips.models import TripRequest, Trip
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

class UserStatsSerializer(serializers.ModelSerializer):
    total_rides = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ["pk","first_name", "total_rides"]

    def get_total_rides(self,obj):
        trips_requests_where_user_is_passenger = TripRequest.objects.filter(passenger__user=obj, status="ACCEPTED", trip__status="FINISHED").count()
        trips_where_user_is_driver = Trip.objects.filter(
           driver_routine__driver__user=obj, status="FINISHED"
        ).count()
        total_rides = trips_where_user_is_driver + trips_requests_where_user_is_passenger
        return total_rides