from driver_routines.models import DriverRoutine
from locations.models import Location
from locations.serializers import LocationSerializer
from rest_framework import serializers
from utils import DAYS_OF_WEEK


class DriverRoutineSerializer(serializers.ModelSerializer):
    origin = LocationSerializer()
    destination = LocationSerializer()
    type = serializers.ReadOnlyField(default='driverRoutine')
    departure_time_start = serializers.TimeField()
    departure_time_end = serializers.TimeField()
    arrival_time = serializers.TimeField()

    class Meta:
        model = DriverRoutine
        fields = (
            "id",
            "origin",
            "destination",
            "day_of_week",
            "departure_time_start",
            "departure_time_end",
            "arrival_time",
            "price",
            "note",
            "is_recurrent",
            "available_seats",
            "type",
        )

    def create(self, validated_data):
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

        driver = self.context["request"].user.driver

        return DriverRoutine.objects.create(
            driver=driver, origin=origin, destination=destination, **validated_data
        )
    
class DriverRoutineCreateSerializer(serializers.ModelSerializer):
    origin = LocationSerializer()
    destination = LocationSerializer()
    type = serializers.ReadOnlyField(default='driverRoutine')
    departure_time_start = serializers.TimeField()
    departure_time_end = serializers.TimeField()
    arrival_time = serializers.TimeField()
    days_of_week = serializers.ListField(child=serializers.ChoiceField(choices=DAYS_OF_WEEK))
    class Meta:
        model = DriverRoutine
        fields = (
            "id",
            "origin",
            "destination",
            "days_of_week",
            "departure_time_start",
            "departure_time_end",
            "arrival_time",
            "price",
            "note",
            "is_recurrent",
            "available_seats",
            "type",
        )

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
        driver = self.context["request"].user.driver
        routines = [] 
        for day in days_of_week:
            routines.append( DriverRoutine.objects.create(
                driver=driver, origin=origin, destination=destination, day_of_week=day, **validated_data
            ))
        return routines
