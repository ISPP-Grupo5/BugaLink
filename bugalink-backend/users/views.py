from allauth.account.models import EmailAddress
from django.db import transaction
from driver_routines.models import DriverRoutine
from drivers.models import Driver
from drivers.serializers import DriverSerializer
from passenger_routines.models import PassengerRoutine
from rest_framework import mixins, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from trips.models import TripRequest
from trips.serializers import TripRequestSerializer
from users.models import User
from users.serializers import (
    UserRatingSerializer,
    UserSerializer,
    UserStatsSerializer,
    UserUpdateSerializer,
)


# users/{id}/ GET Y /users/ GET(list)
class UserViewSet(
    viewsets.GenericViewSet,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def delete(self, request, *args, **kwargs):
        user = request.user
        if user.is_driver:
            if TripRequest.objects.filter(
                trip__driver_routine__driver__user=user,
                status="ACCEPTED",
            ).exists():
                return Response(
                    data={
                        "error": "No puedes eliminar tu cuenta si tienes viajes por hacer como conductor."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            # Delete the driver_routines that the driver has created
            DriverRoutine.objects.filter(driver__user=user).delete()

            # For the driver profile, reject any pending trip requests they may have
            # coming from passengers
            TripRequest.objects.filter(
                trip__driver_routine__driver__user=user,
                status="PENDING",
            ).update(
                status="REJECTED", reject_note="El conductor ha eliminado su cuenta."
            )

        if request.user.is_passenger:
            PassengerRoutine.objects.filter(passenger__user=user).delete()

            # For the passenger profile, delete the pending trip requests they
            # have sent to other drivers
            TripRequest.objects.filter(
                passenger__user=user, status=TripRequest.status == "PENDING"
            ).delete()

        # Anonymize the user's email by adding a timestamp to it
        new_email = f"anonymous_{int(user.date_joined.timestamp())}@bugalink.es"

        # Modify the email in the table account_emailaddress (allauth, used for email authentication)
        email = EmailAddress.objects.filter(user=user).first()
        if email:
            email.email = new_email
            email.save()

        # Do the same with the user entity fields
        user.email = new_email
        user.first_name = "Usuario eliminado"
        user.last_name = ""
        user.photo = ""
        user.is_passenger = False
        user.is_driver = False
        user.is_active = False
        user.set_unusable_password()
        user.save()

        # Get the email entry in the table account_emailaddress and anonymize that email too

        return Response(status=status.HTTP_204_NO_CONTENT)


# /users/{id}/edit PUT. Recibe mediante un form-data: first_name, last_name y photo(file)
class UserUpdateView(APIView):
    @transaction.atomic
    def put(self, request, id):
        if request.user.id != id:
            return Response(
                data={"error": "No tienes permiso para editar esta información"},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = UserUpdateSerializer(request.user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# POST /users/become-driver
class BecomeDriverView(APIView):
    @transaction.atomic
    def post(self, request):
        # If the user is already a driver, return a 400 status code
        if request.user.is_driver:
            return Response(
                data={"error": "El usuario ya es un conductor."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Create a driver profile for the user
        driver = Driver.objects.create(
            user=request.user,
        )
        request.user.is_driver = True
        request.user.save()

        # Return the newly created driver with a 201 status code
        return Response(
            data=DriverSerializer(driver).data, status=status.HTTP_201_CREATED
        )


# GET /users/<user_id>/trip-requests?status=PENDING
# GET /users/<user_id>/trip-requests?status=ACCEPTED
# GET /users/<user_id>/trip-requests?status=FINISHED # HISTORIAL
# También permite filtrar por rol: GET /users/<user_id>/trip-requests?status=FINISHED&role=driver
# Útil para la vista de solicitudes pendientes, quiero filtrar por role=driver para traerme aquellas
# solicitudes pendientes en las que yo soy el driver.
class UserTripsView(APIView):
    def get(self, request, id):
        # If the user is not the same as the one in the URL, return a 403 status code
        if request.user.id != int(id):
            return Response(
                data={
                    "error": "No tienes permiso para ver los viajes de otro usuario."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # Get the status from the query params
        # If the status is not in the query params, don't filter by it
        status_param = request.query_params.get("status")
        role_param = (
            request.query_params.get("role")
            if request.query_params.get("role")
            else "any"
        )
        status_list = status_param.split(",") if status_param else []

        user = User.objects.get(id=id)
        # Get the trips from the user. Those are the trips in which the user is a passenger
        # A trip has a many-to-many relationship with passengers, and we want to see if the
        # user's passenger id from request.user.id is in that list of passengers
        # trip_requests_where_user_is_passenger = TripRequest.objects.filter(
        #     passenger__user=user
        # )

        trips_where_user_is_passenger = (
            TripRequest.objects.filter(passenger__user=user)
            if role_param in ("passenger", "any")
            else TripRequest.objects.none()
        )

        trips_where_user_is_driver = (
            TripRequest.objects.filter(trip__driver_routine__driver__user=user)
            if role_param in ("driver", "any")
            else TripRequest.objects.none()
        )

        trips_by_user = trips_where_user_is_passenger | trips_where_user_is_driver

        # Filter the trips based on the status values
        trips_matching_status = (
            trips_by_user.filter(status__in=status_list)
            if status_list
            else trips_by_user
        ).distinct("trip")

        # Return the trips with a 200 status code
        return Response(
            data=TripRequestSerializer(trips_matching_status, many=True).data
        )


class UserStatsView(viewsets.GenericViewSet, mixins.RetrieveModelMixin):
    queryset = User.objects.all()
    serializer_class = UserStatsSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


class UserRatingView(viewsets.GenericViewSet, mixins.RetrieveModelMixin):
    queryset = User.objects.all()
    serializer_class = UserRatingSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
