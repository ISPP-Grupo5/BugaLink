import copy

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from bugalinkapp.models import *
from django.http import HttpResponse
from django.http import Http404
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from .serializers import *

from rest_framework import viewsets
from rest_framework.decorators import action

from .serializers import DriverRatingSerializer, PassengerRatingSerializer

from rest_framework import serializers


class users(APIView):
    def get(self, request):
        try:
            user = User.objects.get(id=request.data['id'])
            serializer = UserSerializer(user, context={'request': request})
            return Response(serializer.data)
        except User.DoesNotExist:
            raise Http404


class pendingIndividualRide(APIView):
    def get(self, request):
        try:
            user = User.objects.get(id=request.data['id'])
            passenger = Passenger.objects.get(user=user)
            rides = IndividualRide.objects.filter(passenger=passenger, acceptation_status='Pending Confirmation')
            serializer = ListaIndividualRideSerializer({'rides': rides})
            return Response(serializer.data)
        except IndividualRide.DoesNotExist:
            raise Http404


class cancelledIndividualRide(APIView):
    def get(self, request):
        try:
            user = User.objects.get(id=request.data['id'])
            passenger = Passenger.objects.get(user=user)
            rides = IndividualRide.objects.filter(passenger=passenger, acceptation_status='Cancelled')
            serializer = ListaIndividualRideSerializer(rides, many=True)
            return Response(serializer.data)
        except IndividualRide.DoesNotExist:
            raise Http404


class acceptedIndividualRide(APIView):
    def get(self, request):
        try:
            user = User.objects.get(id=request.data['id'])
            passenger = Passenger.objects.get(user=user)
            rides = IndividualRide.objects.filter(passenger=passenger, acceptation_status='Accepted')
            serializer = ListaIndividualRideSerializer(rides, many=True)
            return Response(serializer.data)
        except IndividualRide.DoesNotExist:
            raise Http404

    def get_sporadic_individual_rides(self, request):
        try:
            individual_ride = IndividualRide.objects.get(idIndividualRide=request.data['idIndividualRide'])
            return individual_ride.ride.driver_routine.one_ride
        except Exception as e:
            raise e


class individualRides(APIView):
    def get_individual_ride(self, request):
        try:
            return IndividualRide.objects.get(id=request.data['idIndividualRide'])
        except IndividualRide.DoesNotExist:
            raise Http404

    def get_individual_rides_driver(self, request):
        try:
            individualRides = []

            driver = Driver.objects.get(passenger_id=request.data['idDriver'])
            driverRoutines = DriverRoutine.objects.filter(driver_id=driver.passenger.id)
            for driverRoutine in driverRoutines:
                rides = list(Ride.objects.filter(driver_routine_id=driverRoutine.id))
                for ride in rides:
                    individualRides += list(IndividualRide.objects.filter(ride_id=ride.id))
            return individualRides
        except IndividualRide.DoesNotExist:
            raise Http404

    def get_individual_rides_filter(self, request):
        try:
            individualRides = []

            date = request.data['date']
            lowPrice = request.data['lowPrice']
            highPrice = request.data['highPrice']
            rating = request.data['rating']

            rides = list(Ride.objects.all())
            for ride in rides:
                # Filtramos por fecha
                # Hacemos que la fecha sea la misma. El criterio de filtrado puede cambiar en el futuro
                dateFilter = date == ride.start_date.date

                # Filtramos por valoración
                driver = ride.driver_routine.driver  # Tenemos que sacar al conductor para averiguar su valoración
                ratingFilter = rating <= DriverRating.get_driver_rating(driver)

                # Si se han cumplido estos filtros, revisamos todos los viajes individuales de este viaje
                if (dateFilter and ratingFilter):
                    filteredIndividualRides = list(IndividualRide.objects.filter(ride_id=ride.id))
                    for individualRide in filteredIndividualRides:
                        # Y si el precio del viaje individual supera el filtro, lo añadimos a la lista que devolveremos
                        if lowPrice <= individualRide.price <= highPrice:
                            individualRides.push(individualRide)

            return individualRides
        except IndividualRide.DoesNotExist:
            raise Http404

    def put_individual_ride(self, request):
        try:
            individualRide = IndividualRide.objects.get(id=request.data['idIndividualRide'])
            acceptationStatus = AcceptationStatus.Pending_Confirmation
            match request.data['acceptationStatus']:
                case 'accept':
                    acceptationStatus = AcceptationStatus.Accepted
                case 'cancel':
                    acceptationStatus = AcceptationStatus.Cancelled
            individualRide.acceptation_status = acceptationStatus
            IndividualRide.objects.put(individualRide)
        except IndividualRide.DoesNotExist:
            raise Http404

    """
    Por si se prefiere hacer uso de estas funciones
    """

    def accept_individual_ride(self, request):
        try:
            individualRide = IndividualRide.objects.get(id=request.data['idIndividualRide'])
            individualRide.acceptation_status = AcceptationStatus.Accepted
            IndividualRide.objects.put(individualRide)
        except IndividualRide.DoesNotExist:
            raise Http404

    def cancel_individual_ride(self, request):
        try:
            individualRide = IndividualRide.objects.get(id=request.data['idIndividualRide'])
            individualRide.acceptation_status = AcceptationStatus.Cancelled
            IndividualRide.objects.put(individualRide)
        except IndividualRide.DoesNotExist:
            raise Http404


class RatingViewSet(viewsets.ModelViewSet):
    queryset = DriverRating.objects.all()
    serializer_class = DriverRatingSerializer

    def create(self, request, user_id=None):
        rating_type = request.data.get('rating_type')
        if rating_type == 'driver':
            request.data['driver'] = user_id  # Se especifica el driver
            request.data['user'] = request.user.id  # Se especifica el usuario que hace la valoración
            serializer = DriverRatingSerializer(data=request.data)
        elif rating_type == 'passenger':
            request.data['passenger'] = user_id  # Se especifica el pasajero
            request.data['user'] = request.user.id  # Se especifica el usuario que hace la valoración
            serializer = PassengerRatingSerializer(data=request.data)
        else:
            return Response({'error': 'Invalid rating type'}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, user_id=None):
        if not user_id:
            return Response({'error': 'User ID not provided'}, status=status.HTTP_400_BAD_REQUEST)

        rating_type = request.query_params.get('rating_type')
        if rating_type == 'driver':
            queryset = DriverRating.objects.filter(driver_id=user_id)
            serializer = DriverRatingSerializer(queryset, many=True)
        elif rating_type == 'passenger':
            queryset = PassengerRating.objects.filter(passenger_id=user_id)
            serializer = PassengerRatingSerializer(queryset, many=True)
        else:
            return Response({'error': 'Invalid rating type'}, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.data
        return Response(data, status=status.HTTP_200_OK)


class Rides(APIView):
    def get(self, request, pk, format=None):
        ride_id = pk
        try:
            ride = Ride.objects.get(pk=ride_id)
            serializer = RideSerializer(ride, many=False)
            return Response(serializer.data)
        except ObjectDoesNotExist as e:
            return Response({'error': 'Ride does not exists'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, pk, format=None):
        request.data['status'] = RideStatus.Pending_start
        request.data['pk'] = pk
        try:
            serializer = RideSerializer(request.data, many=False)
            serializer.save()
            return Response(serializer.data)
        except:
            return Response({'error': 'Ride already exists with id {}'.format(pk)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PassengerRoutineList(APIView):
    def get(self, request, pk, format=None):
        try:
            queryset = PassengerRoutine.objects.filter(passennger_id=pk)
        except:
            return Response({'error': 'Passenger does not exist with id {}'.format(pk)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        serializer = PassengerRoutineSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, pk, format=None):  # POST de creacion de la routina
        request.data['passenger_id'] = pk
        try:
            serializer = PassengerRoutineSerializer(request.data, many=False)
            serializer.save()
        except:
            return Response({'error': ''})


class DriverRoutineList(APIView):
    def get(self, request, pk, format=None):
        try:
            queryset = DriverRoutine.objects.filter(driver_id=pk)
        except:
            return Response({'error': 'Passenger does not exist with id {}'.format(pk)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        serializer = DriverRoutineSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, pk, format=None):  # POST de creacion de la routina
        request.data['driver_id'] = pk
        try:
            serializer = DriverRoutineSerializer(request.data, many=False)
            serializer.save()
        except:
            return Response({'error': ''})


class PassengerRoutineDelete(APIView):
    def delete(self, request, user_id, routine_id, format=None):
        try:
            routine = PassengerRoutine.objects.get(pk=routine_id)
        except:
            return Response({'error': 'PassengerRoutine does not exist with id {}'.format(routine_id)})

        serializer = PassengerRoutineSerializer(routine, many=False)
        return Response(serializer.data)

    def put(self, request, user_id, routine_id, format=None):
        try:
            routine = PassengerRoutine.objects.get(pk=routine_id)
        except:
            return Response({'error': 'PassengerRoutine does not exist with id {}'.format(routine_id)})
        try:
            routine.update(**request.data)
        except:
            return Response({'error': 'Invalid arguments'}, status=status.HTTP_400_BAD_REQUEST)


class DriverRoutineDelete(APIView):
    def delete(self, request, user_id, routine_id, format=None):
        try:
            routine = DriverRoutine.objects.get(pk=routine_id)
        except:
            return Response({'error': 'DriverRoutine does not exist with id {}'.format(routine_id)})

        serializer = DriverRoutineSerializer(routine, many=False)
        return Response(serializer.data)

    def put(self, request, user_id, routine_id, format=None):
        try:
            routine = DriverRoutine.objects.get(pk=routine_id)
        except:
            return Response({'error': 'DriverRoutine does not exist with id {}'.format(routine_id)})
        try:
            routine.update(**request.data)
        except:
            return Response({'error': 'Invalid arguments'}, status=status.HTTP_400_BAD_REQUEST)
