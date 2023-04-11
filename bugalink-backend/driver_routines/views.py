from datetime import datetime

from django.shortcuts import get_object_or_404
from rest_framework import mixins, status, viewsets
from rest_framework.response import Response

from driver_routines.models import DriverRoutine
from driver_routines.serializers import DriverRoutineSerializer, DriverRoutineCreateSerializer
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
            return DriverRoutineCreateSerializer  # TODO: use different serializer for GET?
        return DriverRoutineSerializer

    # Individual GET
    def retrieve(self, request, pk=None):
        queryset = DriverRoutine.objects.all()
        driver_routine = get_object_or_404(queryset, pk=pk)
        serializer = DriverRoutineSerializer(driver_routine)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        if not request.user.is_driver:
            return Response(
                {
                    "error": "Debes ser un conductor para crear una rutina como conductor."
                },
                status=status.HTTP_403_FORBIDDEN,
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
                next_weekday(datetime.now(), day),
                routine.departure_time_start,
            )
            arrival_datetime = datetime.combine(
                next_weekday(datetime.now(), day),
                routine.arrival_time,
            )

            Trip.objects.create(
                driver_routine=routine, departure_datetime=departure_datetime, arrival_datetime = arrival_datetime
            )

        response_serializer = DriverRoutineSerializer(routines,many=True)
        headers = self.get_success_headers(response_serializer.data)
        # We return the routines created
        return Response(
            response_serializer.data,
            
            headers=headers,
            status=status.HTTP_201_CREATED
        )
