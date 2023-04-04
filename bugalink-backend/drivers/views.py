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

    # PUT users/<int:user_id>/driver/docs -> Se sube la documentación.
    @action(detail=True, methods=["put"])
    def post_docs(self, request, *args, **kwargs):
        try:
            user_id = kwargs["user_id"]
            passenger = Passenger.objects.get(user_id=user_id)
            driver = m.Driver.objects.get(passenger=passenger)
            status = "Waiting validation"
            if "sworn_declaration" in request.data:
                driver.sworn_declaration = request.data["sworn_declaration"]
                driver.sworn_declaration_status = status
                
            if "driver_license" in request.data:
                driver.driver_license = request.data["driver_license"]
                driver.driver_license_status = status
            
            if "dni_front" in request.data:
                driver.dni_front = request.data["dni_front"]
                driver.dni_status = status

            if "dni_back" in request.data:
                driver.dni_back = request.data["dni_back"]
                driver.dni_status = status

            driver.save()

            return Response(self.get_serializer(driver).data)

        except Passenger.DoesNotExist:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "Passenger does not exist"},
            )

        except m.Driver.DoesNotExist:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "Driver does not exist"},
            )
