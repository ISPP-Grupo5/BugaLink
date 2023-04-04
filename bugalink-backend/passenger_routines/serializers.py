from django.db.models import Q
from driver_routines.models import DriverRoutine
from drivers.models import Driver
from locations.models import Location
from locations.serializers import LocationSerializer
from passenger_routines.models import PassengerRoutine
from passengers.models import Passenger
from rest_framework import serializers
from trips.serializers import TripSerializer


class PassengerRoutineSerializer(serializers.Serializer):
    # TODO: is all this shit necessary?
    id = serializers.IntegerField(read_only=True)
    origin = LocationSerializer()
    destination = LocationSerializer()
    day_of_week = serializers.CharField()
    departure_time_start = serializers.TimeField()
    departure_time_end = serializers.TimeField()

    class Meta:
        model = PassengerRoutine
        fields = ["origin", "destination"]

    def create(self, validated_data):
        origin_data = validated_data.pop("origin")
        destination_data = validated_data.pop("destination")
        # TODO: try to bring existing location if it exists
        origin = Location.objects.create(**origin_data)
        destination = Location.objects.create(**destination_data)

        passenger = self.context["request"].user.passenger

        return PassengerRoutine.objects.create(
            passenger=passenger,
            origin=origin,
            destination=destination,
            **validated_data
        )

    def get_recommendations(self, obj) -> TripSerializer(many=True):
        driver_routines = DriverRoutine.objects.filter(
            day_of_week=obj.day_of_week, available_seats__gt=0
        )
        driver_routines = driver_routines.filter(
            Q(
                departure_time_start__range=[
                    obj.departure_time_start,
                    obj.departure_time_end,
                ]
            )
            | Q(
                departure_time_end__range=[
                    obj.departure_time_start,
                    obj.departure_time_end,
                ]
            )
        )
        recommendable_trips = []
        for driver_routine in driver_routines:
            if (
                driver_routine.origin.get_distance_to(obj.origin) <= 1.0
                and driver_routine.destination.get_distance_to(obj.destination) <= 1.0
            ):
                recommendable_trips.append(driver_routine)
        return TripSerializer(recommendable_trips, many=True)
