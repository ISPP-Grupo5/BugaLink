from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.core import serializers
from rest_framework.views import APIView
from .models import *
from django.http import HttpResponse
from django.http import Http404
from datetime import timedelta
import datetime
from math import radians, sin, cos, atan2, sqrt

from django.contrib.auth.models import User
from .serializers import *

from rest_framework import viewsets
from rest_framework.decorators import action


from rest_framework import serializers


class users(APIView):

    def get_user(self, request):
        try:
            return User.objects.get(idUser=request.data['idUser'])
        except User.DoesNotExist:
            raise Http404

    def get_pending_individual_rides(self, request):
        try:
            return IndividualRide.objects.filter(user=User.objects.get(idUser=request.data['idUser']), status='P')
        except User.DoesNotExist:
            raise Http404

    def get_ongoing_individual_rides(self, request):
        try:
            return IndividualRide.objects.filter(user=User.objects.get(idUser=request.data['idUser']), status='O')
        except User.DoesNotExist:
            raise Http404

    def get_finished_individual_rides(self, request):
        try:
            return IndividualRide.objects.filter(user=User.objects.get(idUser=request.data['idUser']), status='F')
        except User.DoesNotExist:
            raise Http404


class routineRecommendation(APIView):
    def get(self, request):
        try:
            #Definicion de parametros del passenger asociado al user que efectua el filtro
            driver_routines = DriverRoutine.objects.all()
            user = User.objects.get(id=request.data['id'])
            passenger = Passenger.objects.get(user=user)
            passenger_routine = PassengerRoutine.objects.get(
                passenger=passenger)
            beginning_of_ride = passenger_routine.start_date
            end_of_ride = passenger_routine.end_date
            source_location = passenger_routine.start_place
            destination_location = passenger_routine.end_place
            time_diff_before = timedelta(
                seconds=passenger_routine.time_diff_before.total_seconds())
            time_diff_after = timedelta(
                seconds=passenger_routine.time_diff_after.total_seconds())
            passenger_days = passenger_routine.frequency

            #Tramo real de salida, abajo y arriba de la hora introducida
            real_begining_ride_up = (datetime.combine(
                datetime.min, beginning_of_ride) + time_diff_after).time()
            real_begining_ride_down = (datetime.combine(
                datetime.min, beginning_of_ride) - time_diff_before).time()
            
            #Tramo real de llegada, abajo y arriba de la hora introducida
            real_ending_ride_up = (datetime.combine(
                datetime.min, end_of_ride) + time_diff_after).time()
            real_ending_ride_down = (datetime.combine(
                datetime.min, end_of_ride) - time_diff_before).time()

            valid_routines = []

            for routine in driver_routines:
                driver_days = routine.frecuency
                similar_days = []

                #Comprobacion de cuantos dias coinciden en cada rutina
                for day in driver_days:
                    if day in passenger_days:
                        similar_days.append(day)

                #Definir las horas de inicio y fin de la rutina del pasajero
                drivers_beggining_of_ride = routine.start_date
                drivers_ending_of_ride = routine.end_date

                #Definir lugares de inicio y fin de la rutina del conductor
                driver_source_location = routine.start_location
                driver_ending_location = routine.end_location

                #Obtenner en kilometros la distancia en kilometros entre los lugares de origen
                lat_source_passenger, lon_source_passenger = map(radians, source_location)
                lat_source_driver, lon_source_driver = map(radians, driver_source_location)
                d_lat_source = lat_source_driver - lat_source_passenger
                d_lon_source = lon_source_driver - lon_source_passenger
                a = sin(d_lat_source/2)**2 + cos(lat_source_passenger) * cos(lat_source_driver) * sin(d_lon_source/2)**2
                c = 2 * atan2(sqrt(a), sqrt(1-a))
                source_distance = 6371 * c

                #Obtener en kilometros la diferencia de distancia entre los lugares destino
                lat_end_passenger, lon_end_passenger = map(radians, destination_location)
                lat_end_driver, lon_end_driver = map(radians, driver_ending_location)
                d_lat_destination = lat_end_driver - lat_end_passenger
                d_lon_destination = lon_end_driver - lon_end_passenger
                a = sin(d_lat_destination/2)**2 + cos(lat_end_passenger) * cos(lat_end_driver) * sin(d_lon_destination/2)**2
                c = 2 * atan2(sqrt(a), sqrt(1-a))
                destination_distance = 6371 * c

                #Uso de todos los datos obtenidos para crear un filtro que compruebe si la rutina es valida 
                #Si es valida se guarda en una lista
                if len(similar_days) > 0 and real_begining_ride_down <= drivers_beggining_of_ride and real_begining_ride_up >= drivers_beggining_of_ride and real_ending_ride_down <= drivers_ending_of_ride and real_ending_ride_up >= drivers_ending_of_ride and destination_distance <= 1 and source_distance <= 1:
                    valid_routines.append(routine)
            
            #Se obtienen los viajes asociados a las rutinas marcadas como validas y se guardan a una lista que las devolvera como respuesta
            rides = []
            for routine in valid_routines:
                ride = Ride.objects.filter(driver_routine=routine).first()
                if ride:
                    rides.append(ride)
            
            #Llamada al serializer para devolver todos los viajes que han sido seleccionados
            serializer = ListRideSerializer(rides, many=True)
            return Response(serializer.data)
            
        except:
            raise Http404 #Ahora mismo con que exista error me vale.
            
    def get(self, request): 
        try:
            user =  User.objects.get(id = request.data['id'])
            serializer = UserSerializer(user, context = {'request':request})
            return Response(serializer.data)
        except User.DoesNotExist:
            raise Http404
        
class pendingIndividualRide(APIView):
    def get(self,request):
        try:
            user =  User.objects.get(id = request.data['id'])
            passenger = Passenger.objects.get(user = user)
            rides =  IndividualRide.objects.filter(passenger = passenger, acceptation_status = 'Pending Confirmation')
            serializer = ListaIndividualRideSerializer({'rides': rides})
            return Response(serializer.data)            
        except IndividualRide.DoesNotExist:
            raise Http404

class cancelledIndividualRide(APIView):
    def get(self,request):
        try:
            user =  User.objects.get(id = request.data['id'])
            passenger = Passenger.objects.get(user = user)
            rides =  IndividualRide.objects.filter(passenger = passenger, acceptation_status = 'Cancelled')
            serializer = ListaIndividualRideSerializer(rides, many=True)
            return Response(serializer.data)            
        except IndividualRide.DoesNotExist:
            raise Http404
        
class acceptedIndividualRide(APIView):
    def get(self,request):
        try:
            user =  User.objects.get(id = request.data['id'])
            passenger = Passenger.objects.get(user = user)
            rides =  IndividualRide.objects.filter(passenger = passenger, acceptation_status = 'Accepted')
            serializer = ListaIndividualRideSerializer(rides, many=True)
            return Response(serializer.data)            
        except IndividualRide.DoesNotExist:
            raise Http404
    def get_sporadic_individual_rides(self,request):
        try:
            individual_ride = IndividualRide.objects.get(idIndividualRide = request.data['idIndividualRide']) 
            return individual_ride.ride.driver_routine.one_ride
        except Exception as e:
            raise e
        

class individualRides(APIView):
    def get_individual_ride(self, request): 
        try:
            return IndividualRide.objects.get(id = request.data['idIndividualRide'])
        except IndividualRide.DoesNotExist:
            raise Http404
        
    def get_individual_rides_driver(self, request): 
        try:
            individualRides = []
            
            driver = Driver.objects.get(passenger_id = request.data['idDriver'])
            driverRoutines = DriverRoutine.objects.filter(driver_id = driver.passenger.id)
            for driverRoutine in driverRoutines:
                rides = list(Ride.objects.filter(driver_routine_id = driverRoutine.id))
                for ride in rides:
                    individualRides += list(IndividualRide.objects.filter(ride_id = ride.id))
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
                driver = ride.driver_routine.driver # Tenemos que sacar al conductor para averiguar su valoración
                ratingFilter = rating <= DriverRating.get_driver_rating(driver)
                
                # Si se han cumplido estos filtros, revisamos todos los viajes individuales de este viaje
                if (dateFilter and ratingFilter):
                    filteredIndividualRides = list(IndividualRide.objects.filter(ride_id = ride.id))
                    for individualRide in filteredIndividualRides:
                        # Y si el precio del viaje individual supera el filtro, lo añadimos a la lista que devolveremos
                        if lowPrice <= individualRide.price <= highPrice:
                            individualRides.push(individualRide)
                            
            return individualRides
        except IndividualRide.DoesNotExist:
            raise Http404
        
    def put_individual_ride(self, request): 
        try:
            individualRide = IndividualRide.objects.get(id = request.data['idIndividualRide'])
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
            individualRide = IndividualRide.objects.get(id = request.data['idIndividualRide'])
            individualRide.acceptation_status = AcceptationStatus.Accepted
            IndividualRide.objects.put(individualRide)
        except IndividualRide.DoesNotExist:
            raise Http404
        
    def cancel_individual_ride(self, request): 
        try:
            individualRide = IndividualRide.objects.get(id = request.data['idIndividualRide'])
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
