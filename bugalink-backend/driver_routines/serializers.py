from driver_routines.models import DriverRoutine
from locations.models import Location
from locations.serializers import LocationSerializer
from rest_framework import serializers


class DriverRoutineSerializer(serializers.ModelSerializer):
    origin = LocationSerializer()
    destination = LocationSerializer()
    type = serializers.ReadOnlyField(default='driverRoutine')

    class Meta:
        model = DriverRoutine
        fields = (
            "id",
            "origin",
            "destination",
            "day_of_week",
            "departure_time_start",
            "departure_time_end",
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

        # TODO: see if it's the same as self.request.user.driver
        driver = self.context["request"].user.driver

        return DriverRoutine.objects.create(
            driver=driver, origin=origin, destination=destination, **validated_data
        )
