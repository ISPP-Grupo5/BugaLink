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
from .serializers import *



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
