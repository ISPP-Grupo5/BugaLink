from drivers.models import Driver
from drivers.serializers import DriverSerializer, PreferencesSerializer
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.serializers import ValidationError
from users.models import User


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

    # PUT /drivers/docs -> Se sube la documentación.
    @action(detail=True, methods=["put"])
    def post_docs(self, request, *args, **kwargs):
        try:
            user = request.user
        except User.DoesNotExist:
            raise ValidationError("El usuario no existe")

        try:
            driver = Driver.objects.get(user=user)
        except Driver.DoesNotExist:
            driver = Driver.objects.create(user=user)

        user.is_driver = True

        document_status = "Validated"
        if (
            "sworn_declaration" in request.data
            and driver.sworn_declaration_status != "Validated"
        ):
            sworn_declaration_file = request.data["sworn_declaration"]
            extension = sworn_declaration_file.name.split(".")[-1]
            new_filename = f"sworn_declaration.{extension}"
            driver.sworn_declaration.save(new_filename, sworn_declaration_file)
            driver.sworn_declaration_status = document_status

        if (
            "driver_license" in request.data
            and driver.driver_license_status != "Validated"
        ):
            driver_license_file = request.data["driver_license"]
            extension = driver_license_file.name.split(".")[-1]
            new_filename = f"driver_license.{extension}"
            driver.driver_license.save(new_filename, driver_license_file)
            driver.driver_license_status = document_status

        if "dni_front" in request.data and driver.dni_status != "Validated":
            dni_front_file = request.data["dni_front"]
            extension = dni_front_file.name.split(".")[-1]
            new_filename = f"dni_front.{extension}"
            driver.dni_front.save(new_filename, dni_front_file)
            driver.dni_status = document_status

        if "dni_back" in request.data and driver.dni_status != "Validated":
            dni_back_file = request.data["dni_back"]
            extension = dni_back_file.name.split(".")[-1]
            new_filename = f"dni_back.{extension}"
            driver.dni_back.save(new_filename, dni_back_file)
            driver.dni_status = document_status

        if (
            driver.sworn_declaration_status == document_status
            and driver.driver_license_status == document_status
            and driver.dni_status == document_status
        ):
            driver.user.is_validated_driver = True

        driver.user.save()  # Necessary for saving the is_validated_driver field
        driver.save()

        return Response(self.get_serializer(driver).data)


# GET /drivers/<id>/preferences/
class DriverPreferencesView(
    mixins.UpdateModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    queryset = Driver.objects.all()
    serializer_class = PreferencesSerializer

    def obtener(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def actualizar(self, request, *args, **kwargs):
        driver_id = kwargs.get("pk")
        if (
            not self.request.user.is_validated_driver
            or self.request.user.driver.id != driver_id
        ):
            raise ValidationError("No tienes permiso para editar esta información")
        else:
            return self.update(request, *args, **kwargs)
