from django.utils import timezone
from allauth.account.models import EmailAddress
from django.db import transaction
from driver_routines.models import DriverRoutine
from drivers.models import Driver
from drivers.serializers import DriverSerializer
from passenger_routines.models import PassengerRoutine
from rest_framework import mixins, status, viewsets
from rest_framework.response import Response
from rest_framework.serializers import ValidationError
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
                raise ValidationError(
                    "No puedes eliminar tu cuenta si tienes viajes por hacer como conductor"
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
        user.photo.delete()
        user.is_passenger = False
        user.is_driver = False
        user.is_active = False
        user.set_unusable_password()
        user.save()

        # Delete the user's documents if he was also a driver
        driver = Driver.objects.filter(user=user).first()
        if driver:
            driver.dni_front.delete()
            driver.dni_back.delete()
            driver.driver_license.delete()
            driver.sworn_declaration.delete()
            driver.save()

        # Get the email entry in the table account_emailaddress and anonymize that email too
        return Response(status=status.HTTP_204_NO_CONTENT)


# /users/{id}/edit PUT. Recibe mediante un form-data: first_name, last_name y photo(file)
class UserUpdateView(APIView):
    @transaction.atomic
    def put(self, request, id):
        user = request.user
        if request.user.id != id:
            raise ValidationError("No tienes permiso para editar esta información.")
        serializer = UserUpdateSerializer(request.user, data=request.data)

        if serializer.is_valid():
            if "photo" in request.data:
                request.user.photo = request.data["photo"]
                extension = request.data["photo"].name.split(".")[-1]
                new_filename = f"avatar.{extension}"
                user.photo.save(new_filename, request.data["photo"])
            user.first_name = request.data["first_name"]
            user.last_name = request.data["last_name"]
            user.save()

            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# POST /users/become-driver
class BecomeDriverView(APIView):
    @transaction.atomic
    def post(self, request):
        # If the user is already a driver, return a 400 status code
        if request.user.is_driver:
            raise ValidationError("No puedes hacerte conductor porque ya lo eres")
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


# GET /users/<user_id>/trip-requests?requestStatus=XXX&tripStatus=XXX
# También permite filtrar por rol: GET /users/<user_id>/trip-requests?requestStatus=XXX&tripStatus=XXX&role=driver
# Útil para la vista de solicitudes pendientes, quiero filtrar por role=driver para traerme aquellas
# solicitudes pendientes en las que yo soy el driver.
class UserTripsView(APIView):
    # Auxiliar method
    def obtainTrips(self, request, id):
        # Get the status from the query params
        # If the status is not in the query params, don't filter by it
        request_status_param = request.query_params.get("requestStatus")
        trip_status_param = request.query_params.get("tripStatus")
        distinct_param = request.query_params.get("distinct")

        request_status_list = (
            request_status_param.split(",") if request_status_param else []
        )
        trip_status_list = trip_status_param.split(",") if trip_status_param else []

        # If we are fetching rejected trip requests, we also want to fetch those that haven't finished yet (trip_status=PENDING)
        if "REJECTED" in request_status_list:
            trip_status_list.append("PENDING")

        role_param = (
            request.query_params.get("role")
            if request.query_params.get("role")
            else "any"
        )

        user = User.objects.get(id=id)

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
        if "FINISHED" in trip_status_list:
            trips_by_trip_status = trips_by_user.filter(
                trip__arrival_datetime__lt=timezone.now()
            )
        elif "PENDING" in trip_status_list:
            trips_by_trip_status = trips_by_user.filter(
                trip__arrival_datetime__gte=timezone.now()
            )
        else:
            trips_by_trip_status = trips_by_user

        trips_matching_status = (
            trips_by_trip_status.filter(status__in=request_status_list)
            if request_status_list
            else trips_by_trip_status
        )

        # Filter out repeated trips if required
        trips_matching_distinct = (
            trips_matching_status.distinct("trip")
            if distinct_param and distinct_param.lower() == "true"
            else trips_matching_status
        )

        return trips_matching_distinct

    def get(self, request, id):
        # If the user is not the same as the one in the URL, return a 403 status code
        if request.user.id != int(id):
            raise ValidationError(
                "No tienes permiso para ver los viajes de otro usuario."
            )

        trips_matching_status = UserTripsView.obtainTrips(self, request, id)

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


# GET /users/<user_id>/trip-requests/count?request_status=XXX&trip_status=XXX
# También permite filtrar por rol: GET /users/<user_id>/trip-requests?request_status=XXX&trip_status=XXX&role=driver
# Útil para la vista de solicitudes pendientes, quiero filtrar por role=driver para traerme aquellas
# solicitudes pendientes en las que yo soy el driver.
class UserTripCountView(APIView):
    def get(self, request, id):
        # If the user is not the same as the one in the URL, return a 403 status code
        if request.user.id != int(id):
            raise ValidationError(
                "No tienes permiso para ver los viajes de otro usuario."
            )

        trips_matching_status = UserTripsView.obtainTrips(self, request, id)

        # Return the number of trips with a 200 status code
        return Response(
            data={
                "numTrips": len(trips_matching_status),
            }
        )
