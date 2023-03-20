from rest_framework import status
from rest_framework.views import APIView

from django.http import JsonResponse
from math import radians, sin, cos, atan2, sqrt

from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist

#Se importa como m para que no de conflictos con django.db.models
from . import models as m
from .serializers import *

# Imports que deberian desaparecer despues de la refactorización
from rest_framework import viewsets
from django.http import Http404
from rest_framework.response import Response


class Users(APIView):

    def get(self, request, id):
        try:
            user = m.Passenger.objects.get(user_id=id)
            serializer = PassengerSerializer(user, context={'request': request})
            return JsonResponse(serializer.data)
        except m.User.DoesNotExist:
            return JsonResponse({"message": "Not found"}, status=404)


class RoutineRecommendation(APIView):
    def get(self, request):
        try:
            # Definicion de parametros del passenger asociado al user que efectua el filtro
            driver_routines = m.DriverRoutine.objects.all()
            user = m.User.objects.get(id=request.data['id'])
            passenger = m.Passenger.objects.get(user=user)
            passenger_routine = m.PassengerRoutine.objects.get(
                passenger=passenger)
            source_location = passenger_routine.start_location
            destination_location = passenger_routine.end_location
            min_time = passenger_routine.start_time_initial
            max_time = passenger_routine.start_time_final
            passenger_days = passenger_routine.day

            valid_routines = []
            similar_days = []

            for routine in driver_routines:
                driver_day = routine.day

                # Comprobacion de cuantos dias coinciden en cada rutina
                if driver_day in passenger_days:
                    similar_days.append(driver_day)

                # Definir las horas de inicio y fin de la rutina del pasajero
                drivers_beggining_of_ride = routine.start_date
                drivers_ending_of_ride = routine.end_date

                # Definir lugares de inicio y fin de la rutina del conductor
                driver_source_location = routine.start_location
                driver_ending_location = routine.end_location

                # Obtenner en kilometros la distancia en kilometros entre los lugares de origen
                lat_source_passenger, lon_source_passenger = map(radians, source_location)
                lat_source_driver, lon_source_driver = map(radians, driver_source_location)
                d_lat_source = lat_source_driver - lat_source_passenger
                d_lon_source = lon_source_driver - lon_source_passenger
                a = sin(d_lat_source / 2) ** 2 + cos(lat_source_passenger) * cos(lat_source_driver) * sin(
                    d_lon_source / 2) ** 2
                c = 2 * atan2(sqrt(a), sqrt(1 - a))
                source_distance = 6371 * c

                # Obtener en kilometros la diferencia de distancia entre los lugares destino
                lat_end_passenger, lon_end_passenger = map(radians, destination_location)
                lat_end_driver, lon_end_driver = map(radians, driver_ending_location)
                d_lat_destination = lat_end_driver - lat_end_passenger
                d_lon_destination = lon_end_driver - lon_end_passenger
                a = sin(d_lat_destination / 2) ** 2 + cos(lat_end_passenger) * cos(lat_end_driver) * sin(
                    d_lon_destination / 2) ** 2
                c = 2 * atan2(sqrt(a), sqrt(1 - a))
                destination_distance = 6371 * c

                # Uso de todos los datos obtenidos para crear un filtro que compruebe si la rutina es valida
                # Si es valida se guarda en una lista
                if len(similar_days) > 0 and min_time <= drivers_beggining_of_ride and max_time >= drivers_beggining_of_ride and destination_distance <= 1 and source_distance <= 1:
                    valid_routines.append(routine)

            # Se obtienen los viajes asociados a las rutinas marcadas como validas y se guardan a una lista que las devolvera como respuesta
            rides = []
            for routine in valid_routines:
                ride = m.Ride.objects.filter(driver_routine=routine).first()
                if ride:
                    if ride.num_seats > 0:
                        rides.append(ride)

            # Llamada al serializer para devolver todos los viajes que han sido seleccionados
            serializer = ListRideSerializer(rides, many=True)
            return JsonResponse(serializer.data)

        except Exception:
            raise Http404  # Mejorar errores


class PendingIndividualRide(APIView):
    def get(self, request):
        try:
            user = m.User.objects.get(id=request.data['id'])
            passenger = m.Passenger.objects.get(user=user)
            rides = m.IndividualRide.objects.filter(passenger=passenger, acceptation_status='Pending Confirmation')
            serializer = ListIndividualRideSerializer({'rides': rides})
            return JsonResponse(serializer.data)
        except m.IndividualRide.DoesNotExist:
            raise Http404


class CancelledIndividualRide(APIView):
    def get(self, request):
        try:
            user = m.User.objects.get(id=request.data['id'])
            passenger = m.Passenger.objects.get(user=user)
            rides = m.IndividualRide.objects.filter(passenger=passenger, acceptation_status='Cancelled')
            serializer = ListIndividualRideSerializer({'rides': rides})
            return JsonResponse(serializer.data)
        except m.IndividualRide.DoesNotExist:
            raise Http404


class AcceptedIndividualRide(APIView):
    def get(self, request):
        try:
            user = m.User.objects.get(id=request.data['id'])
            passenger = m.Passenger.objects.get(user=user)
            rides = m.IndividualRide.objects.filter(passenger=passenger, acceptation_status='Accepted')
            serializer = ListIndividualRideSerializer({'rides': rides})
            return JsonResponse(serializer.data)
        except m.IndividualRide.DoesNotExist:
            raise Http404

    def get_sporadic_individual_rides(self, request):
        try:
            individual_ride = m.IndividualRide.objects.get(idIndividualRide=request.data['idIndividualRide'])
            return individual_ride.ride.driver_routine.one_ride
        except Exception as e:
            raise e


class IndividualRides(APIView):
    def get(self, request):
        try:
            individual_ride = m.IndividualRide.objects.get(id=request.data['idIndividualRide'])
            serializer = IndividualRideSerializer(individual_ride)
            return JsonResponse(serializer.data)
        except m.IndividualRide.DoesNotExist:
            raise Http404

    def get_individual_rides_driver(self, request):
        try:
            individualRides = []

            user = m.User.objects.get(id=request.data['id'])
            passenger = m.Passenger.objects.get(user=user)
            driver = m.Driver.objects.get(passenger=passenger)
            driverRoutines = m.DriverRoutine.objects.filter(driver_id=driver.passenger.id)
            for driverRoutine in driverRoutines:
                rides = list(m.Ride.objects.filter(driver_routine_id=driverRoutine.id))
                for ride in rides:
                    individualRides += list(m.IndividualRide.objects.filter(ride_id=ride.id))
            return individualRides
        except m.IndividualRide.DoesNotExist:
            raise Http404

class FilteredIndividualRides(APIView):
    def get(self, request):
        try:
            individualRides = []

            date = request.data['date']
            lowPrice = request.data['lowPrice']
            highPrice = request.data['highPrice']
            rating = request.data['rating']

            rides = list(m.Ride.objects.all())
            for ride in rides:
                # Filtramos por fecha
                # Hacemos que la fecha sea la misma. El criterio de filtrado puede cambiar en el futuro
                dateFilter = date == ride.start_date.date

                # Filtramos por valoración
                driver = ride.driver_routine.driver  # Tenemos que sacar al conductor para averiguar su valoración
                ratingFilter = rating <= m.DriverRating.get_driver_rating(driver)

                # Si se han cumplido estos filtros, revisamos todos los viajes individuales de este viaje
                if (dateFilter and ratingFilter):
                    filteredIndividualRides = list(m.IndividualRide.objects.filter(ride_id=ride.id))
                    for individualRide in filteredIndividualRides:
                        # Y si el precio del viaje individual supera el filtro, lo añadimos a la lista que devolveremos
                        if lowPrice <= individualRide.price <= highPrice:
                            individualRides.push(individualRide)
            
            serializer = ListIndividualRideSerializer({'individualRides': individualRides})
            return JsonResponse(serializer.data)
        except m.IndividualRide.DoesNotExist:
            raise Http404

class AcceptIndividualRide:
    def put(self, request):
        try:
            individualRide = m.IndividualRide.objects.get(id=request.data['idIndividualRide'])
            individualRide.acceptation_status = m.AcceptationStatus.Accepted
            m.IndividualRide.objects.put(individualRide)
        except m.IndividualRide.DoesNotExist:
            raise Http404

class CancelIndividualRide:
    def put(self, request):
        try:
            individualRide = m.IndividualRide.objects.get(id=request.data['idIndividualRide'])
            individualRide.acceptation_status = m.AcceptationStatus.Cancelled
            m.IndividualRide.objects.put(individualRide)
        except m.IndividualRide.DoesNotExist:
            raise Http404


class PendingRoutineRequests(APIView):
    def get(self, request):
        try:
            user = m.User.objects.get(id=request.data['id'])
            passenger = m.Passenger.objects.get(user=user)
            routines = m.PassengerRoutine.objects.filter(passenger=passenger)
            routineRequests = []
            for routine in routines:
                routineRequests += m.RoutineRequest.objects.filter(passenger_routine=routine, acceptation_status='Pending Confirmation')
            driver = m.Driver.objects.get(passenger=passenger)
            routines = m.DriverRoutine.objects.filter(driver=driver)
            for routine in routines:
                routineRequests += m.RoutineRequest.objects.filter(driver_routine=routine, acceptation_status='Pending Confirmation')
            serializer = ListRoutineRequestSerializer({'routineRequests': routineRequests})
            return JsonResponse(serializer.data)
        except m.IndividualRide.DoesNotExist:
            raise Http404
        
class AcceptedRoutineRequests(APIView):
    def get(self, request):
        try:
            user = m.User.objects.get(id=request.data['id'])
            passenger = m.Passenger.objects.get(user=user)
            routines = m.PassengerRoutine.objects.filter(passenger=passenger)
            routineRequests = []
            for routine in routines:
                routineRequests += m.RoutineRequest.objects.filter(passenger_routine=routine, acceptation_status='Accepted')
            driver = m.Driver.objects.get(passenger=passenger)
            routines = m.DriverRoutine.objects.filter(driver=driver)
            for routine in routines:
                routineRequests += m.RoutineRequest.objects.filter(driver_routine=routine, acceptation_status='Accepted')
            serializer = ListRoutineRequestSerializer({'routineRequests': routineRequests})
            return JsonResponse(serializer.data)
        except m.IndividualRide.DoesNotExist:
            raise Http404
        
class CanceledRoutineRequests(APIView):
    def get(self, request):
        try:
            user = m.User.objects.get(id=request.data['id'])
            passenger = m.Passenger.objects.get(user=user)
            routines = m.PassengerRoutine.objects.filter(passenger=passenger)
            routineRequests = []
            for routine in routines:
                routineRequests += m.RoutineRequest.objects.filter(passenger_routine=routine, acceptation_status='Canceled')
            driver = m.Driver.objects.get(passenger=passenger)
            routines = m.DriverRoutine.objects.filter(driver=driver)
            for routine in routines:
                routineRequests += m.RoutineRequest.objects.filter(driver_routine=routine, acceptation_status='Canceled')
            serializer = ListRoutineRequestSerializer({'routineRequests': routineRequests})
            return JsonResponse(serializer.data)
        except m.IndividualRide.DoesNotExist:
            raise Http404


class RatingViewSet(viewsets.ModelViewSet):
    queryset = m.DriverRating.objects.all()
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
            return JsonResponse({'error': 'Invalid rating type'}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, user_id=None):
        if not user_id:
            return JsonResponse({'error': 'User ID not provided'}, status=status.HTTP_400_BAD_REQUEST)

        rating_type = request.query_params.get('rating_type')
        if rating_type == 'driver':
            queryset = m.DriverRating.objects.filter(driver_id=user_id)
            serializer = DriverRatingSerializer(queryset, many=True)
        elif rating_type == 'passenger':
            queryset = m.PassengerRating.objects.filter(passenger_id=user_id)
            serializer = PassengerRatingSerializer(queryset, many=True)
        else:
            return JsonResponse({'error': 'Invalid rating type'}, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.data
        return JsonResponse(data, status=status.HTTP_200_OK)


class Rides(APIView):
    def get(self, request, pk, format=None):
        ride_id = pk
        try:
            ride = m.Ride.objects.get(pk=ride_id)
            serializer = RideSerializer(ride, many=False)
            return JsonResponse(serializer.data)
        except ObjectDoesNotExist as e:
            return JsonResponse({'error': 'Ride does not exists'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, pk, format=None):
        request.data['status'] = m.RideStatus.Pending_start
        request.data['pk'] = pk
        try:
            serializer = RideSerializer(request.data, many=False)
            serializer.save()
            return JsonResponse(serializer.data)
        except Exception:
            return JsonResponse({'error': 'Ride already exists with id {}'.format(pk)},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PassengerRoutineList(APIView):
    def get(self, request, pk, format=None):
        try:
            queryset = m.PassengerRoutine.objects.filter(passenger_id=pk)
            print(queryset)
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'Passenger does not exist with id {}'.format(pk)},
                                status=status.HTTP_400_BAD_REQUEST)
        serializer = ListPassengerRoutineSerializer({"passenger_routines":queryset})
        return JsonResponse(serializer.data)

    def post(self, request, pk, format=None):  # POST de creacion de la routina
        request.data['passenger_id'] = pk
        try:
            serializer = PassengerRoutineSerializer(request.data, many=False)
            serializer.save()
        except Exception:
            return JsonResponse({'error': ''})


class DriverRoutineList(APIView):
    def get(self, request, pk, format=None):
        try:
            queryset = m.DriverRoutine.objects.filter(driver_id=pk)
            serializer = ListDriverRoutineSerializer({"driver_routines":queryset})
            return JsonResponse(serializer.data)
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'Passenger does not exist with id {}'.format(pk)},
                                status=status.HTTP_400_BAD_REQUEST)
        

    def post(self, request, pk, format=None):  # POST de creacion de la routina
        request.data['driver_id'] = pk
        try:
            serializer = DriverRoutineSerializer(request.data, many=False)
            serializer.save()
        except Exception:
            return JsonResponse({'error': ''})


class PassengerRoutine(APIView):
    def delete(self, request, user_id, routine_id, format=None):
        try:
            routine = m.PassengerRoutine.objects.get(pk=routine_id)
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'PassengerRoutine does not exist with id {}'.format(routine_id)},
                                status=status.HTTP_400_BAD_REQUEST)

        serializer = PassengerRoutineSerializer(routine, many=False)
        return JsonResponse(serializer.data)

    def put(self, request, user_id, routine_id, format=None):
        try:
            routine = m.PassengerRoutine.objects.get(pk=routine_id)
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'PassengerRoutine does not exist with id {}'.format(routine_id)},
                                status=status.HTTP_400_BAD_REQUEST)
        try:
            routine.update(**request.data)
        except Exception:
            return JsonResponse({'error': 'Invalid arguments'}, status=status.HTTP_400_BAD_REQUEST)


class DriverRoutine(APIView):
    def delete(self, request, user_id, routine_id, format=None):
        try:
            #Definicion de parametros del passenger asociado al user que efectua el filtro
            driver_routines = m.DriverRoutine.objects.all()
            user = m.User.objects.get(id=request.data['id'])
            passenger = m.Passenger.objects.get(user=user)
            passenger_routine = m.PassengerRoutine.objects.get(
                passenger=passenger)
            source_location = passenger_routine.start_location
            destination_location = passenger_routine.end_location
            min_time = passenger_routine.start_time_initial
            max_time = passenger_routine.start_time_final
            passenger_days = passenger_routine.day

            valid_routines = []
            similar_days = []

            for routine in driver_routines:
                driver_days = routine.day

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
                if len(similar_days) > 0 and min_time <= drivers_beggining_of_ride and max_time >= drivers_beggining_of_ride and destination_distance <= 1 and source_distance <= 1:
                    valid_routines.append(routine)
            
            #Se obtienen los viajes asociados a las rutinas marcadas como validas y se guardan a una lista que las devolvera como respuesta
            rides = []
            for routine in valid_routines:
                ride = m.Ride.objects.filter(driver_routine=routine).first()
                if ride:
                    if ride.num_seats > 0:
                        rides.append(ride)
            
            #Llamada al serializer para devolver todos los viajes que han sido seleccionados
            serializer = ListRideSerializer(rides, many=True)
            return JsonResponse(serializer.data)
            
        except:
            raise Http404 #Mejorar errores
       
    



