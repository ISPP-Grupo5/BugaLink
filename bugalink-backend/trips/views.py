import datetime

from django.db.models import Q
from locations.models import Location
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from trips.models import Trip, TripRequest
from trips.serializers import (
    TripRequestCreateSerializer,
    TripRequestSerializer,
    TripSerializer,
)
from users.serializers import UserRatingSerializer

from .utils import (
    check_allows_pets,
    check_allows_smoking,
    check_date_from,
    check_date_to,
    check_days,
    check_distance,
    check_hour_from,
    check_hour_to,
    check_maxprice,
    check_minprice,
    check_minstars,
    check_prefers_music,
    check_prefers_talk,
)


class TripViewSet(
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        # TODO: untested!!
        # If the one deleting the trip is not the driver who created it, return 403
        if request.user != self.get_object().driver_routine.driver.user:
            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={
                    "error": "Un viaje sólo puede ser eliminado por el conductor que lo publicó"
                },
            )

        return self.destroy(request, *args, **kwargs)


class TripRequestViewSet(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = TripRequest.objects.all()
    serializer_class = TripRequestSerializer

    def get_serializer_class(self):
        if self.action == "create":
            return (
                TripRequestCreateSerializer  # TODO: use different serializer for GET?
            )
        return super().get_serializer_class()

    # POST /trips/<id>/request/ (For a passenger to request a trip)
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # NOTE: this saves the entity in the DB and returns the created object
        serializer.save()

        created_id = serializer.instance.id
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"id": created_id, **serializer.data},
            # self.get_serializer(driver_routine).data,
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

    # PUT /trip-requests/<pk>/accept/ (For a driver to accept a trip request)
    @action(detail=True, methods=["put"])
    def accept(self, request, *args, **kwargs):
        trip_request = self.get_object()
        trip_request.status = "ACCEPTED"
        trip_request.save()
        return Response(self.get_serializer(trip_request).data)

    # PUT /trip-requests/<pk>/reject/ (For a driver to reject a trip request)
    @action(detail=True, methods=["put"])
    def reject(self, request, *args, **kwargs):
        trip_request = self.get_object()
        trip_request.status = "REJECTED"
        trip_request.save()
        return Response(self.get_serializer(trip_request).data)


class TripSearchViewSet(
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

    @action(detail=True, methods=["get"])
    def get(self, request, *args, **kwargs):
        # Se busca entre los viajes pendientes
        trips = Trip.objects.filter(status="PENDING")
        result_trips = []
        # Comprobacion de campos obligatorios
        if not request.GET.get("origin") or not request.GET.get("destination"):
            return Response(
                {"message": "El origen y el destino son obligatorios"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        origin_lat, origin_lon = request.GET.get("origin").split(",")
        dest_lat, dest_lon = request.GET.get("destination").split(",")
        origin_location = Location(
            latitude=float(origin_lat), longitude=float(origin_lon)
        )
        dest_location = Location(latitude=float(dest_lat), longitude=float(dest_lon))

        try:
            if request.GET.get("days"):
                trips = check_days(trips, request.GET.get("days"))

            if request.GET.get("min_price"):
                trips = check_minprice(trips, request.GET.get("min_price"))

            if request.GET.get("max_price"):
                trips = check_maxprice(trips, request.GET.get("max_price"))

            result_trips = check_distance(
                result_trips, trips, origin_location, dest_location
            )

            if request.GET.get("min_stars"):
                result_trips = check_minstars(
                    result_trips, request.GET.get("min_stars")
                )

            if request.GET.get("date_from"):
                result_trips = check_date_from(
                    result_trips, request.GET.get("date_from")
                )

            if request.GET.get("date_to"):
                result_trips = check_date_to(result_trips, request.GET.get("date_to"))

            if request.GET.get("hour_from"):
                result_trips = check_hour_from(
                    result_trips, request.GET.get("hour_from")
                )

            if request.GET.get("hour_to"):
                result_trips = check_hour_to(result_trips, request.GET.get("hour_to"))

            if request.GET.get("prefers_music"):
                result_trips = check_prefers_music(
                    result_trips, request.GET.get("prefers_music")
                )

            if request.GET.get("prefers_talk"):
                result_trips = check_prefers_talk(
                    result_trips, request.GET.get("prefers_talk")
                )

            if request.GET.get("allows_pets"):
                result_trips = check_allows_pets(
                    result_trips, request.GET.get("allows_pets")
                )

            if request.GET.get("allows_smoking"):
                result_trips = check_allows_smoking(
                    result_trips, request.GET.get("allows_smoking")
                )

            result_trips = Trip.objects.filter(
                Q(pk__in=[trip.pk for trip in result_trips])
            ).order_by("-departure_datetime")[:10]

            data = {"trips": []}
            for trip in result_trips:
                data["trips"].append(TripSerializer(trip).data)
            return Response(data, status=status.HTTP_200_OK)
        except Exception:
            return Response(
                {"message": "No se han encontrado viajes compatibles"},
                status=status.HTTP_200_OK,
            )
