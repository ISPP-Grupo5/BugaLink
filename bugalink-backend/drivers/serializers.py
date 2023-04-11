from driver_routines.serializers import DriverRoutineSerializer
from drivers.models import Driver
from rest_framework import serializers
from trips.models import Trip
from trips.serializers import TripSerializer


class DriverSerializer(serializers.ModelSerializer):
    # NOTE: if the serializer is giving info we don't need, try the following:
    # routines = DriverRoutineSerializer(many=True)

    routines = serializers.SerializerMethodField()
    trips = serializers.SerializerMethodField()

    class Meta:
        model = Driver
        fields = (
            "id",
            "routines",
            "trips",
            "dni_status",
            "driver_license_status",
            "sworn_declaration_status",
        )

    def get_routines(self, obj) -> DriverRoutineSerializer(many=True):
        routines = obj.routines.all()
        return DriverRoutineSerializer(routines, many=True).data

    def get_trips(self, obj) -> TripSerializer(many=True):
        # Get the trips where the driver is the driver
        trips = Trip.objects.filter(driver_routine__driver=obj)
        return TripSerializer(trips, many=True).data


class PreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ("prefers_talk", "prefers_music", "allows_pets", "allows_smoke")
