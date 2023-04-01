# Serializer of Passenger model that contains only its routine object

from rest_framework import serializers

from passenger_routines.models import Passenger
from passenger_routines.serializers import PassengerRoutineSerializer
from trips.models import Trip
from trips.serializers import TripSerializer


class PassengerSerializer(serializers.ModelSerializer):
    routines = serializers.SerializerMethodField()

    class Meta:
        model = Passenger
        fields = ("id", "routines", "trips")

    def get_routines(self, obj):
        routines = obj.routines.all()
        return PassengerRoutineSerializer(routines, many=True).data

    def get_trips(self, obj):
        # Get the trips where the passenger is in the list of passengers
        trips = Trip.objects.filter(passengers__in=[obj])
        return TripSerializer(trips, many=True).data
