from django.http import JsonResponse
from requests import Response
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action

from drivers.models import Driver
from passengers.models import Passenger
from drivers.serializers import DriverSerializer

from . import models as m


class DriverViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

