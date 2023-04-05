from locations.models import Location
from locations.serializers import LocationSerializer
from passenger_routines.models import PassengerRoutine
from passengers.models import Passenger
from rest_framework import serializers
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
    type = serializers.ReadOnlyField(default='passengerRoutine')

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



class PassengerRoutineCreateSerializer(serializers.Serializer):
    # TODO: is all this shit necessary?
    id = serializers.IntegerField(read_only=True)
    origin = LocationSerializer()
    destination = LocationSerializer()
    days_of_week = serializers.ListField(child=serializers.ChoiceField(choices=DAYS_OF_WEEK))
    departure_time_start = serializers.TimeField()
    departure_time_end = serializers.TimeField()
    arrival_time = serializers.TimeField()
    type = serializers.ReadOnlyField(default='passengerRoutine')

    class Meta:
        model = PassengerRoutine
        fields = ["origin", "destination","days_of_week","departure_time_start","departure_time_end"]

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
            routine =  PassengerRoutine.objects.create(
            passenger=passenger,
            origin=origin,
            destination=destination,
            day_of_week=day,
            **validated_data
            )
            routines.append(routine)
        return routines