from ratings.models import DriverRating
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
            "date_joined",
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
    
class UserRatingSerializer(serializers.ModelSerializer):
    rating = serializers.SerializerMethodField()
    number_ratings = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ["pk", "number_ratings", "rating"]

    def get_rating(self,obj) -> serializers.FloatField:
        ratings = DriverRating.objects.filter(trip_request__trip__driver_routine__driver__user=obj)
        if len(ratings) == 0:
            return 0
        values = [r.rating for r in ratings]
        return  sum(values)/len(ratings)
    
    def get_number_ratings(self,obj) -> serializers.IntegerField:
        count = DriverRating.objects.filter(trip_request__trip__driver_routine__driver__user=obj).count()
        return count

class UserStatsSerializer(UserRatingSerializer):
    total_rides = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ["pk","first_name", "total_rides", "number_ratings", "rating"]

    def get_total_rides(self,obj) -> serializers.IntegerField:
        trips_requests_where_user_is_passenger = TripRequest.objects.filter(passenger__user=obj, status="ACCEPTED", trip__status="FINISHED").count()
        trips_where_user_is_driver = Trip.objects.filter(
           driver_routine__driver__user=obj, status="FINISHED"
        ).count()
        total_rides = trips_where_user_is_driver + trips_requests_where_user_is_passenger
        return total_rides
