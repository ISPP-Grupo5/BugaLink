from driver_routines.serializers import DriverRoutineSerializer
from ratings.models import DriverRating, Report
from rest_framework import serializers
from trips.models import Trip, TripRequest
from users.models import User
from users.serializers import (
    DriverAsUserSerializer,
    PassengerAsUserSerializer,
    UserSerializer,
)


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


class TripUsersSerializer(serializers.ModelSerializer):
    users = serializers.SerializerMethodField()

    class Meta:
        model = Trip
        fields = ("users",)

    def get_users(self, obj) -> UserSerializer(many=True):
        accepted_requests = TripRequest.objects.filter(trip=obj, status="ACCEPTED")
        users = [t_r.passenger.user for t_r in accepted_requests]
        users.append(obj.driver_routine.driver.user)
        return UserSerializer(users, many=True).data


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
        note = validated_data.get("note", None)  # Note is optional
        return TripRequest.objects.create(
            passenger=passenger, trip=trip, note=note, price=price
        )


class TripReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ("reported_user_id", "note")


class TripRateSerializer(serializers.ModelSerializer):
    rating = serializers.FloatField()
    is_good_driver = serializers.BooleanField()
    is_pleasant_driver = serializers.BooleanField()
    already_knew = serializers.BooleanField()

    class Meta:
        model = DriverRating
        fields = ("rating", "is_good_driver", "is_pleasant_driver", "already_knew")

    def create(self, trip_request):
        self.is_valid(raise_exception=True)
        validated_data = self.validated_data
        rating = validated_data.pop("rating")
        is_good_driver = validated_data.pop("is_good_driver")
        is_pleasant_driver = validated_data.pop("is_pleasant_driver")
        already_knew = validated_data.pop("already_knew")
        driver_rating = DriverRating.objects.create(
            trip_request=trip_request,
            rating=rating,
            is_good_driver=is_good_driver,
            is_pleasant_driver=is_pleasant_driver,
            already_knew=already_knew,
        )
        return driver_rating
