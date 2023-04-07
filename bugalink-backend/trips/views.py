import datetime

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
    def get(
        self,
        request,
        origin,
        destination,
        days,
        minstars,
        minprice,
        maxprice,
        date_from,
        date_to,
        hour_from,
        hour_to,
        prefers_music,
        prefers_talk,
        allows_pets,
        allows_smoking,
        *args,
        **kwargs
    ):
        try:
            # Se busca entre los viajes pendientes
            trips = Trip.objects.filter(status="PENDING")
            result_trips = []
            # Comprobacion de campos obligatorios
            if origin and destination:
                origin_lat, origin_lon = origin.split(",")
                dest_lat, dest_lon = destination.split(",")
                origin_location = Location.objects.create(
                    latitude=float(origin_lat), longitude=float(origin_lon)
                )
                dest_location = Location.objects.create(
                    latitude=float(dest_lat), longitude=float(dest_lon)
                )
                # Comprobacion distancia origen y destino
                check_distance(result_trips, trips, origin_location, dest_location)

                # Comprobacion dias
                if days:
                    check_days(result_trips, days)

                # Comprobacion puntuacion de driver
                if minstars:
                    check_minstars(result_trips, minstars)

                # Comprobacion precio minimo
                if minprice:
                    check_minprice(result_trips, minprice)

                # Comprobacion precio maximo
                if maxprice:
                    check_maxprice(result_trips, maxprice)

                # Comprobacion fecha desde (dateFrom)
                if date_from:
                    check_date_from(result_trips, date_from)

                # Comprobacion fecha hasta (dateTo)
                if date_to:
                    check_date_to(result_trips, date_to)

                # Comprobacion hora desde (hourFrom)
                if hour_from:
                    check_hour_from(result_trips, hour_from)

                # Comprobacion hora hasta
                if hour_to:
                    check_hour_to(result_trips, hour_to)

                # Comprobacion preferencia musica
                if prefers_music:
                    check_prefers_music(result_trips, prefers_music)

                # Comprobacion preferencia hablar
                if prefers_talk:
                    check_prefers_talk(result_trips, prefers_talk)

                # Comprobacion preferencia mascota
                if allows_pets:
                    check_allows_pets(result_trips, allows_pets)

                # Comprobacion preferencia fumar
                if allows_smoking:
                    check_allows_smoking(result_trips, allows_smoking)

                if len(result_trips) > 0:
                    data = {"trips": []}
                    for trip in result_trips:
                        data["trips"].append(TripSerializer(trip).data)
                    return Response(data, status=status.HTTP_200_OK)
                else:
                    return Response(
                        {"message": "No se han encontrado viajes compatibles"},
                        status=status.HTTP_200_OK,
                    )

            else:
                return Response(
                    {"message": "El origen y el destino son obligatorios"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except Exception as e:
            return Response({"message": str(e)})
