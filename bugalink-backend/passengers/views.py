from rest_framework import mixins, viewsets

from passengers.models import Passenger
from passengers.serializers import PassengerSerializer


class PassengerViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Passenger.objects.all()
    serializer_class = PassengerSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
