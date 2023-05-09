# Serializer of Passenger model that contains only its routine object

from passenger_routines.models import Passenger
from passenger_routines.serializers import PassengerRoutineSerializer
from rest_framework import serializers
from trips.models import Trip, TripRequest
from trips.serializers import TripSerializer


class PassengerSerializer(serializers.ModelSerializer):
    routines = serializers.SerializerMethodField()
    trips = serializers.SerializerMethodField()

    class Meta:
        model = Passenger
        fields = ("id", "user", "routines", "trips")

    def get_routines(self, obj) -> PassengerRoutineSerializer(many=True):
        routines = obj.routines.all()
        return PassengerRoutineSerializer(routines, many=True).data
    
    def get_trips(self, obj) -> TripSerializer(many=True):
        # Get the trips where the passenger is in the list of passengers
        trip_requests = TripRequest.objects.filter(passenger=obj)
        trips = [t_r.trip for t_r in trip_requests]
        return TripSerializer(trips, many=True).data
