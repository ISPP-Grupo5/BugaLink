from django.shortcuts import get_object_or_404
from rest_framework import mixins, status, viewsets
from rest_framework.response import Response

from passenger_routines.models import PassengerRoutine
from passenger_routines.serializers import PassengerRoutineSerializer, PassengerRoutineCreateSerializer


class PassengerRoutineViewSet(
    # GET, POST, PUT, DELETE
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = PassengerRoutine.objects.all()
    serializer_class = PassengerRoutineSerializer

    def get_serializer_class(self):
        if self.action == "create":
            return PassengerRoutineCreateSerializer
        return PassengerRoutineSerializer

    # Individual GET
    # /passenger-routines/1/
    def retrieve(self, request, pk=None):
        queryset = PassengerRoutine.objects.all()
        passenger_routine = get_object_or_404(queryset, pk=pk)
        serializer = PassengerRoutineSerializer(passenger_routine)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        # NOTE: this creates all the routines
        routines = serializer.create()
        response_serializer = PassengerRoutineSerializer(routines,many=True)
        headers = self.get_success_headers(response_serializer.data)
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers,
        )
