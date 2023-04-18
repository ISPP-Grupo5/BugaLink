import decimal
import os

import django.core.exceptions
from bugalink_backend import settings
from django.db import transaction
from django.db.models import Q
from django.shortcuts import redirect
from passenger_routines.models import PassengerRoutine
from passengers.models import Passenger
from payment_methods.models import Balance
from ratings.models import DriverRating, Report
from ratings.serializers import DriverRatingSerializer, ReportSerializer
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from transactions.models import Transaction
from trips.models import Trip, TripRequest
from trips.serializers import (
    TripReportSerializer,
    TripRequestCreateSerializer,
    TripRequestSerializer,
    TripSerializer,
    TripUsersSerializer,
)
from users.models import User
from users.serializers import UserSerializer

from .serializers import TripRateSerializer
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
    get_recommendations,
)

query_format_exception_message = "Existe algún valor inadecuado"


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

    @action(detail=False, methods=["get"])
    def list_recommendations(self, request, *args, **kwargs):
        user = request.user
        recommendations = []
        for passenger_routine in PassengerRoutine.objects.filter(
            passenger__user_id=user.id
        ):
            recommendations += get_recommendations(obj=passenger_routine).data
        return Response(recommendations)


class TripRequestViewSet(
    mixins.RetrieveModelMixin,
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

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    # POST /trips/<id>/request/ (For a passenger to request a trip)
    # POST /trips/<id>/request/ (For a passenger to request a trip)
    @transaction.atomic
    def create(self, trip_id, user_id, note):
        try:
            trip = Trip.objects.get(id=trip_id)
            user = User.objects.get(id=user_id)
            price = trip.driver_routine.price if user.is_pilotuser else trip.driver_routine.price * \
                decimal.Decimal(1.15)
            passenger = Passenger.objects.get(user=user)
            Transaction.objects.create(
                sender=user,
                receiver=trip.driver_routine.driver.user,
                amount=price,
            )

            TripRequest.objects.create(
                trip=trip,
                status="PENDING",
                note=note,
                reject_note="",
                passenger=passenger,
                price=price,
            )
            return True
        except django.core.exceptions.ObjectDoesNotExist:
            return False

    # GET /trip-requests/pending/count/ (For a driver to get the number of pending requests)

    def count(self, request, *args, **kwargs):
        num_pending_requests = TripRequest.objects.filter(
            trip__driver_routine__driver__user=request.user,
            trip__status="PENDING",
            status="PENDING",
        )
        return Response({"count": num_pending_requests.count()})

    # PUT /trip-requests/<pk>/accept/ (For a driver to accept a trip request)

    @action(detail=True, methods=["put"])
    def accept(self, request, *args, **kwargs):
        trip_request = TripRequest.objects.get(id=kwargs["pk"])
        trip_request.status = "ACCEPTED"
        trip_request.save()
        return Response(self.get_serializer(trip_request).data)

    # PUT /trip-requests/<pk>/reject/ (For a driver to reject a trip request)
    @action(detail=True, methods=["put"])
    def reject(self, request, *args, **kwargs):
        trip_request = TripRequest.objects.get(id=kwargs["pk"])
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
        try:
            # Se busca entre los viajes pendientes
            trips = Trip.objects.filter(status="PENDING")
            # Comprobacion de campos obligatorios
            if not request.GET.get("origin") or not request.GET.get("destination"):
                return Response(
                    {"message": "El origen y el destino son obligatorios"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            filter_checks = {
                "days": check_days,
                "min_price": check_minprice,
                "max_price": check_maxprice,
                "date_from": check_date_from,
                "date_to": check_date_to,
                "hour_from": check_hour_from,
                "hour_to": check_hour_to,
                "prefers_music": check_prefers_music,
                "prefers_talk": check_prefers_talk,
                "allows_pets": check_allows_pets,
                "allows_smoking": check_allows_smoking,
            }

            # Apply all filters on the QuerySet
            for key, func in filter_checks.items():
                if request.GET.get(key):
                    trips = func(trips, request.GET.get(key))

            # Comprobacion de distancia
            trips = check_distance(
                trips, request.GET.get("origin"), request.GET.get("destination")
            )

            # Comprobacion de minStars
            if request.GET.get("min_stars"):
                trips = check_minstars(trips, request.GET.get("min_stars"))

            trips = Trip.objects.filter(Q(pk__in=[trip.pk for trip in trips])).order_by(
                "-departure_datetime"
            )[:10]

            return Response(
                TripSerializer(trips, many=True).data, status=status.HTTP_200_OK
            )
        except ValueError:
            return Response(
                {"message": query_format_exception_message},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except django.core.exceptions.FieldError:
            return Response(
                {"message": query_format_exception_message},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except django.core.exceptions.ValidationError:
            return Response(
                {"message": query_format_exception_message},
                status=status.HTTP_400_BAD_REQUEST,
            )


class TripRateViewSet(
    viewsets.GenericViewSet,
):
    queryset = TripRequest.objects.all()
    serializer_class = TripRateSerializer

    @action(detail=True, methods=["post"])
    def post(self, request, trip_id, *args, **kwargs):
        serializer = TripRateSerializer(data=request.data)

        trip = Trip.objects.get(id=trip_id)
        trip_request = None
        if trip.status != "FINISHED":
            return Response(
                {"message": "No se puede valorar un viaje que no ha terminado"},
                status=status.HTTP_403_FORBIDDEN,
            )
        trip_request = TripRequest.objects.filter(
            trip=trip, status="ACCEPTED", passenger__user=request.user
        ).first()
        driver_rating = DriverRating.objects.filter(trip_request=trip_request)
        if len(driver_rating) > 0:
            return Response(
                {"message": "Ya ha valorado este viaje"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if trip_request:
            driver_rating = serializer.create(trip_request)
            response_serializer = DriverRatingSerializer(driver_rating)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "No has participado en este viaje "})


class ReportIssuePostViewSet(
    viewsets.GenericViewSet,
):
    serializer_class = TripReportSerializer

    @action(detail=True, methods=["post"])
    def post(self, request, trip_id, *args, **kwargs):
        serializer = TripReportSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # reported_user_id = serializer.data["reported_user_id"]

        # 404 validations
        try:
            trip = Trip.objects.get(id=trip_id)
            # reported_user = User.objects.get(id=reported_user_id)
        except Trip.DoesNotExist:
            return Response(
                {"message": "El viaje no existe"}, status=status.HTTP_404_NOT_FOUND
            )
        except User.DoesNotExist:
            return Response(
                {"message": "El usuario al que intenta reportar no existe"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        trip_request = TripRequest.objects.filter(
            trip=trip, passenger__user=request.user, status="ACCEPTED"
        ).first()

        if trip_request is None and trip.driver_routine.driver.user != request.user:
            return Response(
                {"message": "No has participado en este viaje"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if trip.status != "FINISHED":
            return Response(
                {"message": "No se puede reportar un viaje que no ha terminado"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        else:
            report = serializer.create(trip=trip, reporter_user=request.user)
            response_serializer = ReportSerializer(report)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class ReportIssueGetViewSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin):
    queryset = Trip.objects.all()
    serializer_class = TripUsersSerializer

    @action(detail=True, methods=["get"])
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
