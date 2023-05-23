from datetime import datetime

from django.shortcuts import get_object_or_404
from driver_routines.models import DriverRoutine
from driver_routines.serializers import (
    DriverRoutineCreateSerializer,
    DriverRoutineSerializer,
)
from locations.models import Location
from rest_framework import mixins, status, viewsets
from rest_framework.response import Response
from rest_framework.serializers import ValidationError
from trips.models import Trip
from utils import next_weekday


class DriverRoutineViewSet(
    # CRUD operations
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = DriverRoutine.objects.all()

    def get_serializer_class(self):
        if self.action == "create":
            return DriverRoutineCreateSerializer
        return DriverRoutineSerializer

    # Individual GET
    def retrieve(self, request, pk=None):
        queryset = DriverRoutine.objects.all()
        driver_routine = get_object_or_404(queryset, pk=pk)
        serializer = DriverRoutineSerializer(driver_routine)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        if not request.user.is_driver:
            raise ValidationError(
                "Debes ser un conductor para crear una rutina como conductor"
            )

        serializer = self.get_serializer(data=request.data)
        # NOTE: this creates a routine for each day and return a list of them
        routines = serializer.create()
        for routine in routines:
            # When creating a driver_routine, we also need to create a Trip
            day = routine.day_of_week
            # Create a datetime object with the first day of the week, next closest date
            # The time will be the departure_time_start

            departure_datetime = datetime.combine(
                next_weekday(datetime.now(), day, routine.departure_time_start),
                routine.departure_time_start,
            )
            arrival_datetime = datetime.combine(
                next_weekday(datetime.now(), day, routine.departure_time_start),
                routine.arrival_time,
            )

            Trip.objects.create(
                driver_routine=routine,
                departure_datetime=departure_datetime,
                arrival_datetime=arrival_datetime,
            )

        response_serializer = DriverRoutineSerializer(routines, many=True)
        headers = self.get_success_headers(response_serializer.data)
        # We return the routines created
        return Response(
            response_serializer.data, headers=headers, status=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        routine_original = DriverRoutine.objects.get(id=kwargs["pk"])
        routine_request = request.data
        serializer = DriverRoutineCreateSerializer(routine_request)

        routine_original.price = routine_request.get("price")
        routine_original.note = routine_request.get("note")
        routine_original.available_seats = routine_request.get("available_seats")
        routine_original.departure_time_start = routine_request.get(
            "departure_time_start"
        )
        routine_original.departure_time_end = routine_request.get("departure_time_end")
        routine_original.arrival_time = routine_request.get("arrival_time")
        routine_original.origin = Location.objects.create(
            **serializer.data.pop("origin")
        )
        routine_original.destination = Location.objects.create(
            **serializer.data.pop("destination")
        )
        routine_original.save()

        return Response(routine_request, status=status.HTTP_200_OK)
