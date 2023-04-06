from django.db.models import Q
from locations.models import Location
from locations.serializers import LocationSerializer
from passenger_routines.models import PassengerRoutine
from rest_framework import serializers
from trips.models import Trip
from trips.serializers import TripSerializer
from utils import DAYS_OF_WEEK


class PassengerRoutineSerializer(serializers.Serializer):
    # TODO: is all this shit necessary?
    id = serializers.IntegerField(read_only=True)
    origin = LocationSerializer()
    destination = LocationSerializer()
    day_of_week = serializers.CharField()
    departure_time_start = serializers.TimeField()
    departure_time_end = serializers.TimeField()
    arrival_time = serializers.TimeField()
    type = serializers.ReadOnlyField(default="passengerRoutine")

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
        trips = Trip.objects.filter(
            driver_routine__day_of_week=obj.day_of_week, status="PENDING"
        )

        recommendable_trips = []
        for trip in trips:
            if (
                trip.driver_routine.origin.get_distance_to(obj.origin) <= 1.0
                and trip.driver_routine.destination.get_distance_to(obj.destination)
                <= 1.0
                and trip.get_avaliable_seats() > 0
                and trip.driver_routine.departure_time_start
                <= obj.departure_time_end  # drivers_beggining_of_ride_0 <= max_time
                and trip.driver_routine.departure_time_end
                >= obj.departure_time_start  # drivers_beggining_of_ride_1 >= min_time
            ):
                recommendable_trips.append(trip)
        recommendable_trips = Trip.objects.filter(
            Q(pk__in=[trip.pk for trip in recommendable_trips])
        )
        return TripSerializer(recommendable_trips, many=True)


class PassengerRoutineCreateSerializer(serializers.Serializer):
    # TODO: is all this shit necessary?
    id = serializers.IntegerField(read_only=True)
    origin = LocationSerializer()
    destination = LocationSerializer()
    days_of_week = serializers.ListField(
        child=serializers.ChoiceField(choices=DAYS_OF_WEEK)
    )
    departure_time_start = serializers.TimeField()
    departure_time_end = serializers.TimeField()
    arrival_time = serializers.TimeField()
    type = serializers.ReadOnlyField(default="passengerRoutine")

    class Meta:
        model = PassengerRoutine
        fields = [
            "origin",
            "destination",
            "days_of_week",
            "departure_time_start",
            "departure_time_end",
        ]

    def create(self):
        self.is_valid(raise_exception=True)
        validated_data = self.validated_data
        days_of_week = validated_data.pop("days_of_week")
        origin_data = validated_data.pop("origin")
        destination_data = validated_data.pop("destination")
        # If the origin and destination Location objects do not already
        # exist, they will be created.
        origin = Location.objects.filter(**origin_data).first()
        destination = Location.objects.filter(**destination_data).first()
        if not origin:
            origin = Location.objects.create(**origin_data)
        if not destination:
            destination = Location.objects.create(**destination_data)
        passenger = self.context["request"].user.passenger
        routines = []
        for day in days_of_week:
            routine = PassengerRoutine.objects.create(
                passenger=passenger,
                origin=origin,
                destination=destination,
                day_of_week=day,
                **validated_data
            )
            routines.append(routine)
        return routines
