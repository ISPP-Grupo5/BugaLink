from rest_framework import serializers

from locations.models import Location
from locations.serializers import LocationSerializer
from passenger_routines.models import PassengerRoutine
from passengers.models import Passenger


class PassengerRoutineSerializer(serializers.Serializer):
    # TODO: is all this shit necessary?
    id = serializers.IntegerField(read_only=True)
    origin = LocationSerializer()
    destination = LocationSerializer()
    days_of_week = serializers.ListField(child=serializers.CharField())
    departure_time_start = serializers.TimeField()
    departure_time_end = serializers.TimeField()
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
