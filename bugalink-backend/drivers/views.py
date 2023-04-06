
from requests import Response
from rest_framework import mixins, status, viewsets

from drivers.models import Driver
from drivers.serializers import DriverSerializer
from rest_framework import mixins, viewsets, status

from drivers.models import Driver
from drivers.serializers import DriverSerializer, PreferencesSerializer
from users.models import User
from rest_framework.response import Response

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


#GET /drivers/<id>/preferences/
class DriverPreferencesView(mixins.UpdateModelMixin,
                          mixins.RetrieveModelMixin,
                          viewsets.GenericViewSet):
    queryset= Driver.objects.all()
    serializer_class=PreferencesSerializer
    
    def obtener(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def actualizar(self, request, *args, **kwargs):
        driver_id = kwargs.get("pk")
        if not self.request.user.is_driver or self.request.user.driver.id != driver_id:
            return Response(
                data={
                    "error": "No tienes permiso para editar esta información"
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        else:
            return self.update(request, *args, **kwargs)
