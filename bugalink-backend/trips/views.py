from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from trips.models import Trip, TripRequest
from trips.serializers import (
    TripRequestCreateSerializer,
    TripRequestSerializer,
    TripSerializer,
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
