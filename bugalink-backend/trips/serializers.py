from driver_routines.serializers import DriverRoutineSerializer
from rest_framework import serializers
from trips.models import Trip, TripRequest
from users.serializers import DriverAsUserSerializer, PassengerAsUserSerializer


class TripSerializer(serializers.ModelSerializer):
    driver_routine = DriverRoutineSerializer()
    passengers = PassengerAsUserSerializer(many=True)
    driver = serializers.SerializerMethodField()

    class Meta:
        model = Trip
        fields = ("id", "driver_routine", "passengers", "driver", "departure_datetime")

    def get_driver(self, obj):
        driver_routine = obj.driver_routine
        return DriverAsUserSerializer(driver_routine.driver).data


class TripRequestSerializer(serializers.ModelSerializer):
    trip = TripSerializer()

    class Meta:
        model = TripRequest
        fields = ("id", "trip", "status", "note")


class TripRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripRequest
        fields = ("id", "note")

    def create(self, validated_data):
        # Get the trip from the URL path
        trip_id = self.context["view"].kwargs["id"]
        trip = Trip.objects.get(id=trip_id)
        passenger = self.context["request"].user.passenger
        # add the passenger to trip passengers list
        trip.passengers.add(passenger)
        note = validated_data.pop("note")
        is_recurrent = validated_data.pop("is_recurrent")

        return TripRequest.objects.create(
            trip=trip, note=note, is_recurrent=is_recurrent
        )
