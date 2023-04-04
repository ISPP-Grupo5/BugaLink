
from http.client import BAD_REQUEST
from django.db import transaction
from datetime import datetime,timedelta
from drivers.models import Driver
from drivers.serializers import DriverSerializer
from rest_framework import status, viewsets, mixins
from rest_framework.response import Response
from rest_framework.views import APIView
from trips.models import TripRequest
from trips.serializers import TripRequestSerializer
from users.models import User
from users.serializers import UserSerializer, PreferencesSerializer


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


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
            preference_0=False,
            preference_1=False,
            preference_2=False,
            preference_3=False,
        )
        request.user.is_driver = True
        request.user.save()

        # Return the newly created driver with a 201 status code
        return Response(
            data=DriverSerializer(driver).data, status=status.HTTP_201_CREATED
        )


# GET /users/<user_id>/trip-requests?status=pending
# GET /users/<user_id>/trip-requests?status=accepted
# GET /users/<user_id>/trip-requests?status=finished # HISTORIAL
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
        status_list = status_param.split(",") if status_param else []

        user = User.objects.get(id=id)
        # Get the trips from the user. Those are the trips in which the user is a passenger
        # A trip has a many-to-many relationship with passengers, and we want to see if the
        # user's passenger id from request.user.id is in that list of passengers
        # trip_requests_where_user_is_passenger = TripRequest.objects.filter(
        #     passenger__user=user
        # )

        trips_where_user_is_passenger = TripRequest.objects.filter(passenger__user=user)

        trips_where_user_is_driver = TripRequest.objects.filter(
            trip__driver_routine__driver__user=user
        )

        trips_by_user = trips_where_user_is_passenger | trips_where_user_is_driver

        # Filter the trips based on the status values
        trips_matching_status = (
            trips_by_user.filter(status__in=status_list)
            if status_list
            else trips_by_user
        )

        # Return the trips with a 200 status code
        return Response(
            data=TripRequestSerializer(trips_matching_status, many=True).data
        )

#GET /users/<id>/preferences/
class UserPreferencesView(mixins.UpdateModelMixin,
                          mixins.RetrieveModelMixin,
                          viewsets.GenericViewSet):
    queryset= Driver.objects.all()
    serializer_class=PreferencesSerializer
    
    def obtener(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def actualizar(self, request, *args, **kwargs):
        user_id = kwargs.get("pk")
        if self.request.user.id != user_id:
            return Response(
                data={
                    "error": "No tienes permiso para editar esta información"
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        else:
            return self.update(request, *args, **kwargs)

# GET /users/<user_id>/trip-requests/count?status=pending
# GET /users/<user_id>/trip-requests/count?status=accepted
# GET /users/<user_id>/trip-requests/count?status=finished # HISTORIAL
class UserTripCountView(APIView):
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
        status_list = status_param.split(",") if status_param else []

        user = User.objects.get(id=id)
        # Get the trips from the user. Those are the trips in which the user is a passenger
        # A trip has a many-to-many relationship with passengers, and we want to see if the
        # user's passenger id from request.user.id is in that list of passengers
        # trip_requests_where_user_is_passenger = TripRequest.objects.filter(
        #     passenger__user=user
        # )

        trips_where_user_is_passenger = TripRequest.objects.filter(passenger__user=user)

        trips_where_user_is_driver = TripRequest.objects.filter(
            trip__driver_routine__driver__user=user
        )

        trips_by_user = trips_where_user_is_passenger | trips_where_user_is_driver

        # Filter the trips based on the status values
        trips_matching_status = (
            trips_by_user.filter(status__in=status_list)
            if status_list
            else trips_by_user
        )

        # Return the number of trips with a 200 status code
        return Response(
            data= {
                "numTrips": len(trips_matching_status),
            }
        )
        
# GET /users/<user_id>/trips/upcoming
class UserUpcomingTripsView(APIView):
    def get(self, request, id):
        # If the user is not the same as the one in the URL, return a 403 status code
        if request.user.id != int(id):
            return Response(
                data={
                    "error": "No tienes permiso para ver los viajes de otro usuario."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        user = User.objects.get(id=id)
        # Get the trips from the user. Those are the trips in which the user is a passenger
        # A trip has a many-to-many relationship with passengers, and we want to see if the
        # user's passenger id from request.user.id is in that list of passengers
        # trip_requests_where_user_is_passenger = TripRequest.objects.filter(
        #     passenger__user=user
        # )

        trips_where_user_is_passenger = TripRequest.objects.filter(passenger__user=user)

        trips_where_user_is_driver = TripRequest.objects.filter(
            trip__driver_routine__driver__user=user
        )

        trips_by_user = trips_where_user_is_passenger | trips_where_user_is_driver

        # Filter the trips based on the status values
        upcoming_trips = trips_by_user.filter(
            trip__departure_datetime__range=[datetime.now(), datetime.now() + timedelta(hours=48)])

        # Return the trips with a 200 status code
        return Response(
            data=TripRequestSerializer(upcoming_trips, many=True).data
        )
