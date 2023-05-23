import datetime
import os
import transactions.utils as TransactionUtils
import django.core.exceptions
import transactions.utils as TransactionUtils
from django.db import transaction
from django.db.models import Q
from django.shortcuts import redirect
from django.utils import timezone
from passenger_routines.models import PassengerRoutine
from passengers.models import Passenger
from ratings.models import DriverRating
from ratings.serializers import DriverRatingSerializer, ReportSerializer
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.serializers import ValidationError
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
        if request.user != self.get_object().driver_routine.driver.user:
            raise ValidationError("No puedes eliminar un viaje que no es tuyo")

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
    @transaction.atomic
    def create(self, trip_id, user_id, price, note):
        try:
            trip = Trip.objects.get(id=trip_id)
            user = User.objects.get(id=user_id)
            passenger = Passenger.objects.get(user=user)
            transaction = Transaction.objects.create(
                sender=user,
                receiver=trip.driver_routine.driver.user,
                amount=price,
            )

            TripRequest.objects.create(
                trip=trip,
                note=note,
                reject_note="",
                passenger=passenger,
                price=price,
                transaction=transaction,
            )
            return True
        except django.core.exceptions.ObjectDoesNotExist:
            return False

        return Response(
            self.get_serializer(trip_request).data, status=status.HTTP_201_CREATED
        )

    # GET /trip-requests/pending/count/ (For a driver to get the number of pending requests)
    def count(self, request, *args, **kwargs):
        num_pending_requests = TripRequest.objects.filter(
            trip__driver_routine__driver__user=request.user,
            trip__arrival_datetime__lt=timezone.now(),
            status="PENDING",
        )
        return Response({"count": num_pending_requests.count()})

    # PUT /trip-requests/<pk>/accept/ (For a driver to accept a trip request)

    @action(detail=True, methods=["put"])
    def accept(self, request, *args, **kwargs):
        trip_request = TripRequest.objects.get(id=kwargs["pk"])
        trip = Trip.objects.get(id=trip_request.trip.pk)
        free_seats = trip.get_avaliable_seats()
        if free_seats <= 0:
            raise ValidationError("No hay asientos libres disponibles")
        TransactionUtils.accept_transaction(trip_request.transaction)
        trip_request.status = "ACCEPTED"
        trip_request.save()
        return Response(self.get_serializer(trip_request).data)

    # PUT /trip-requests/<pk>/reject/ (For a driver to reject a trip request)
    @action(detail=True, methods=["put"])
    def reject(self, request, *args, **kwargs):
        trip_request = TripRequest.objects.get(id=kwargs["pk"])
        try:
            TransactionUtils.reject_transaction(trip_request.transaction)
        except Exception:
            # This may raise with requests from the populate.py as they may not have a transaction
            print("Error al rechazar la transacción")
        TransactionUtils.reject_transaction(trip_request.transaction)
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
            trips = Trip.objects.filter(arrival_datetime__gt=timezone.now())
            # Comprobacion de campos obligatorios
            if not request.GET.get("origin") or not request.GET.get("destination"):
                raise ValidationError("El origen y el destino son obligatorios")

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
            )

            return Response(
                TripSerializer(trips, many=True).data, status=status.HTTP_200_OK
            )
        except (
            ValueError,
            django.core.exceptions.FieldError,
            django.core.exceptions.ValidationError,
        ):
            raise ValidationError("Existe algún valor inadecuado")


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
            raise ValidationError("No puedes valorar un viaje que aún no ha terminado")
        trip_request = TripRequest.objects.filter(
            trip=trip, status="ACCEPTED", passenger__user=request.user
        ).first()
        driver_rating = DriverRating.objects.filter(trip_request=trip_request)
        if len(driver_rating) > 0:
            raise ValidationError("Ya has valorado este viaje")
        if trip_request:
            driver_rating = serializer.create(trip_request)
            response_serializer = DriverRatingSerializer(driver_rating)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        else:
            raise ValidationError("No has participado en este viaje ")


class ReportIssuePostViewSet(
    viewsets.GenericViewSet,
):
    serializer_class = TripReportSerializer

    @action(detail=True, methods=["post"])
    def post(self, request, trip_id, *args, **kwargs):
        serializer = TripReportSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            trip = Trip.objects.get(id=trip_id)
        except Trip.DoesNotExist:
            raise ValidationError("El viaje no existe")
        except User.DoesNotExist:
            raise ValidationError("El usuario al que intenta reportar no existe")
        except Exception:
            raise ValidationError("Ha ocurrido un error inesperado")

        trip_request = TripRequest.objects.filter(
            trip=trip, passenger__user=request.user, status="ACCEPTED"
        ).first()

        if trip_request is None and trip.driver_routine.driver.user != request.user:
            return Response(
                {"message": "No has participado en este viaje"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if trip.status != "FINISHED":
            raise ValidationError("No se puede reportar un viaje que no ha terminado")

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


class CreateNextWeekTrip(viewsets.GenericViewSet):
    @action(detail=True, methods=["post"])
    def post(self, request, *args, **kwargs):
        try:
            trips = Trip.objects.filter(
                Q(departure_datetime__lt=datetime.datetime.now())
                & Q(arrival_datetime__lt=timezone.now())
            )
            week_begin_date = (
                datetime.date.today()
                - datetime.timedelta(days=datetime.date.today().isoweekday() % 7)
                + datetime.timedelta(days=1)
            )
            week_end_date = week_begin_date + datetime.timedelta(days=6)
            day_mapper = {
                "Mon": 0,
                "Tue": 1,
                "Wed": 2,
                "Thu": 3,
                "Fri": 4,
                "Sat": 5,
                "Sun": 6,
            }
            for trip in trips:
                departure_date = week_begin_date + datetime.timedelta(
                    days=7 + day_mapper[trip.driver_routine.day_of_week]
                )
                arrival_date = week_begin_date + datetime.timedelta(
                    days=7 + day_mapper[trip.driver_routine.day_of_week]
                )

                if (
                    trip.driver_routine.departure_time_start
                    > trip.driver_routine.arrival_time
                ):
                    arrival_date = arrival_date + datetime.timedelta(days=1)

                departure_datetime = datetime.datetime.combine(
                    departure_date, trip.driver_routine.departure_time_start
                )
                arrival_datetime = datetime.datetime.combine(
                    arrival_date, trip.driver_routine.arrival_time
                )

                trip_already_created = Trip.objects.filter(
                    driver_routine=trip.driver_routine,
                    departure_datetime__gt=(
                        week_begin_date + datetime.timedelta(days=7)
                    ),
                    arrival_datetime__lt=(week_end_date + datetime.timedelta(days=7)),
                )

                if (
                    not trip_already_created.exists()
                    and trip.driver_routine.is_recurrent
                ):
                    Trip.objects.create(
                        driver_routine=trip.driver_routine,
                        arrival_datetime=arrival_datetime,
                        departure_datetime=departure_datetime,
                    )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {"log": "All next week trips has been created."}, status=status.HTTP_200_OK
        )
