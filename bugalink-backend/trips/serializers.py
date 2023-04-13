from driver_routines.serializers import DriverRoutineSerializer
from rest_framework import serializers
from trips.models import Trip, TripRequest
from users.serializers import DriverAsUserSerializer, PassengerAsUserSerializer

class SimpleTripSerializer(serializers.ModelSerializer):
    driver_routine = DriverRoutineSerializer()
    driver = serializers.SerializerMethodField()
    departure_datetime = serializers.DateTimeField()
    arrival_datetime = serializers.DateTimeField()
    class Meta:
        model = Trip
        fields = (
            "id",
            "driver_routine",
            "driver",
            "departure_datetime",
            "arrival_datetime",
            "status",
        )
    def get_driver(self, obj) -> DriverAsUserSerializer():
        driver_routine = obj.driver_routine
        return DriverAsUserSerializer(driver_routine.driver).data

class TripSerializer(serializers.ModelSerializer):
    driver_routine = DriverRoutineSerializer()
    passengers = serializers.SerializerMethodField()
    driver = serializers.SerializerMethodField()
    departure_datetime = serializers.DateTimeField()
    arrival_datetime = serializers.DateTimeField()

    class Meta:
        model = Trip
        fields = (
            "id",
            "driver_routine",
            "passengers",
            "driver",
            "departure_datetime",
            "arrival_datetime",
            "status",
        )

    def get_passengers(self, obj) -> PassengerAsUserSerializer(many=True):
        # Filter for those trip requests in which trip=obj and status=accepted
        trip_requests = TripRequest.objects.filter(trip=obj, status="ACCEPTED")
        return PassengerAsUserSerializer(
            [trip_request.passenger for trip_request in trip_requests], many=True
        ).data

    def get_driver(self, obj) -> DriverAsUserSerializer():
        driver_routine = obj.driver_routine
        return DriverAsUserSerializer(driver_routine.driver).data


class TripRequestSerializer(serializers.ModelSerializer):
    trip = TripSerializer()

    class Meta:
        model = TripRequest
        fields = ("id", "trip", "passenger", "status", "note")


class TripRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripRequest
        fields = ("id", "note")

    # TODO: Verificar que no se solicita un viaje a si mismo y que no lo ha solicitado ya
    def create(self, validated_data):
        # Get the trip from the URL path
        trip_id = self.context["view"].kwargs["trip_id"]
        trip = Trip.objects.get(id=trip_id)
        passenger = self.context["request"].user.passenger
        price = trip.driver_routine.price
        note = validated_data.pop("note")
        return TripRequest.objects.create(
            passenger=passenger, trip=trip, note=note, price=price
        )
