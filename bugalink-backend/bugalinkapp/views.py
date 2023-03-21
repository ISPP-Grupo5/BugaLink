import datetime
from django.db import IntegrityError
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

                # Obtener en kilometros la distancia en kilometros entre los lugares de origen
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
            return JsonResponse(serializer.data, status = 200)

        except Exception:
            return JsonResponse({"message": "No hay viajes recomendados para ti"}, status=400)


class PendingIndividualRide(APIView):
    def get(self, request):
        try:
            user = m.User.objects.get(id=request.data['id'])
            passenger = m.Passenger.objects.get(user=user)
            rides = m.IndividualRide.objects.filter(passenger=passenger, acceptation_status='Pending Confirmation')
            serializer = ListIndividualRideSerializer({'individual_rides': rides})
            return JsonResponse(serializer.data)
        except m.IndividualRide.DoesNotExist:
            raise Http404


class CancelledIndividualRide(APIView):
    def get(self, request):
        try:
            user = m.User.objects.get(id=request.data['id'])
            passenger = m.Passenger.objects.get(user=user)
            rides = m.IndividualRide.objects.filter(passenger=passenger, acceptation_status='Cancelled')
            serializer = ListIndividualRideSerializer({'individual_rides': rides})
            return JsonResponse(serializer.data)
        except m.IndividualRide.DoesNotExist:
            raise Http404


class AcceptedIndividualRide(APIView):
    def get(self, request):
        try:
            user = m.User.objects.get(id=request.data['id'])
            passenger = m.Passenger.objects.get(user=user)
            rides = m.IndividualRide.objects.filter(passenger=passenger, acceptation_status='Accepted')
            serializer = ListIndividualRideSerializer({'individual_rides': rides})
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

            driver = m.Driver.objects.get(passenger_id=request.data['idDriver'])
            driverRoutines = m.DriverRoutine.objects.filter(driver_id=driver.passenger.id)
            for driverRoutine in driverRoutines:
                rides = list(m.Ride.objects.filter(driver_routine_id=driverRoutine.id))
                for ride in rides:
                    individualRides += list(m.IndividualRide.objects.filter(ride_id=ride.id))
            return individualRides
        except m.IndividualRide.DoesNotExist:
            raise Http404

    def get_individual_rides_filter(self, request):
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

            return individualRides
        except m.IndividualRide.DoesNotExist:
            raise Http404

    def put_individual_ride(self, request):
        try:
            individualRide = m.IndividualRide.objects.get(id=request.data['idIndividualRide'])
            '''
            acceptationStatus = AcceptationStatus.Pending_Confirmation
            match request.data['acceptationStatus']:
                case 'accept':
                    acceptationStatus = AcceptationStatus.Accepted
                case 'cancel':
                    acceptationStatus = AcceptationStatus.Cancelled
            individualRide.acceptation_status = acceptationStatus
            '''
            m.IndividualRide.objects.put(individualRide)
        except m.IndividualRide.DoesNotExist:
            raise Http404

    def get_sporadic_individual_rides(self, request):
            try:
                individual_ride = IndividualRide.objects.get(idIndividualRide=request.data['idIndividualRide'])
                return individual_ride.ride.driver_routine.one_ride
            except Exception as e:
                raise e
            
            

class CancelIndividualRide(APIView):
    def post(self, request):  
        try:
            indiviudal_ride = IndividualRide.objects.get(id=request.data["idIndividualRide"])
        except IndividualRide.DoesNotExist:
            return JsonResponse({'error': 'Ride not found'}, status=404)

        diff = datetime.datetime.now() - indiviudal_ride.start_date
        if diff.total_seconds() < 86400 :    # Si quedan menos de 24 horas para el viaje
            return JsonResponse({'error': 'Cancelation deadline has passed'}, status=400)

        indiviudal_ride.delete()
        return JsonResponse({'success': True})
    
############## ENDPOINTS ASOCIADOS A RIDE
class CreateIndividualRide(APIView):
    def post(self, request):
        if request.method == 'POST':
            user = User.objects.get(id=request.data["userId"])
            passenger = Passenger.objects.get(user = user)
            ride = Ride.objects.get(id=request.data["rideId"])
            driver_routine = ride.driver_routine
            day = driver_routine.days

            passenger_routine_qs = PassengerRoutine.objects.filter(passenger = passenger, days = request.data["day"]) 
            list_passenger_routine = list(passenger_routine_qs) # L-8 , L-10, L-19

            not_satisfied_passenger_routines = []
            for p_routine in list_passenger_routine:    # Se obtienen todos passenger routines no satisfechos por una routine_request
                routine_request = RoutineRequest.objects.get(passenger_routine = p_routine, acceptation_status = AcceptationStatus.Accepted)
                if routine_request == None:
                    not_satisfied_passenger_routines.append(p_routine)

            for passenger_routine in not_satisfied_passenger_routines:
                p_r = PassengerRoutine.objects.get(passenger_routine.start_time_initial <= ride.start_date <= passenger_routine.start_time_final)
                if p_r != None:
                    satisfied = True
                    break

            if satisfied == True:
                passenger_routine = p_r
            else:
                passenger_routine = PassengerRoutine(
                    passenger = passenger,
                    start_location = driver_routine.start_location,
                    end_location = driver_routine.end_location,
                    days = day,
                    end_date = driver_routine.end_date,
                    start_time_initial = driver_routine.start_date,
                    start_time_final = driver_routine.start_date)
                passenger_routine.save()

            i_r = IndividualRide(ride = ride,
            passenger = passenger,
            passenger_routine= passenger_routine,
            price = 0,      # TODO Pendiente de revisión
            ride_status = RideStatus.Pending_start,
            acceptation_status = AcceptationStatus.Pending_Confirmation,
            start_date = ride.start_date,
            end_date = ride.end_date,
            start_location = ride.start_location,
            end_location = ride.end_location,
            message= request.data["message"]
            )
            i_r.save()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'error': 'Invalid request method'})

class Rides(APIView):
    def cancel_individual_ride(self, request):
        try:
            individualRide = m.IndividualRide.objects.get(id=request.data['idIndividualRide'])
            individualRide.acceptation_status = m.AcceptationStatus.Cancelled
            m.IndividualRide.objects.put(individualRide)
        except m.IndividualRide.DoesNotExist:
            raise Http404

class Rating(APIView):
    def get(self, request):
        user_id = request.data.get('userId')
        if not user_id:
            return JsonResponse({'error': 'UserId not provided'}, status=status.HTTP_400_BAD_REQUEST)

        driver_rating_list = []
        passenger_rating_list =[]
        try:
            driver_rating_list = list(m.DriverRating.objects.filter(individual_ride__ride__driver_routine__driver__passenger__user__pk=user_id))
        except Exception:
            pass
        try:
            passenger_rating_list = list(m.PassengerRating.objects.filter(individual_ride__passenger__user__pk=user_id))
        except Exception:
            pass
        numeric_driver_rating_list = [rating.rating for rating in driver_rating_list]
        numeric_passenger_rating_list = [rating.rating for rating in passenger_rating_list]
        try:
            passenger = m.Passenger.objects.get(user_id=user_id)
            passenger_serializer = PassengerSerializer(passenger)
        except m.Passenger.DoesNotExist:
            return JsonResponse({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        if len(numeric_driver_rating_list) >0 or len(numeric_passenger_rating_list) > 0:
            rating = (sum(numeric_driver_rating_list) + sum(numeric_passenger_rating_list)) / (len(numeric_passenger_rating_list) + len(numeric_driver_rating_list))
        else:
            rating=0
        data = {
            "passenger": passenger_serializer.data,
            "rating":rating
        }
        return JsonResponse(data)
        

class PendingRatings(APIView):
    def get(self, request):           
        user_id = request.data.get('userId')
        # comprobaciones varias
        if not user_id:
            return JsonResponse({'error': 'UserId not provided'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user_id = int(user_id)
        except ValueError:
            return JsonResponse({'error': 'UserId must be int'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            passenger = m.Passenger.objects.get(user_id=user_id)
        except m.Passenger.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        try:
            passenger_individual_rides = list(m.IndividualRide.objects.filter(passenger__user__pk=user_id, ride__status="Finished"))
        except Exception:
            pass
        try:
            driver_individual_rides = list(m.IndividualRide.objects.filter(ride__driver_routine__driver__passenger__user__pk=user_id, ride__status="Finished"))
        except Exception:
            pass

        # Se busca para los individual_rides que ha hecho como passenger si existe una valoración del Driver
        individual_rides_pending_for_rating=[]
        for individual_ride in passenger_individual_rides:
            try:
                m.DriverRating.objects.get(individual_ride=individual_ride)
            except m.DriverRating.DoesNotExist:
                individual_rides_pending_for_rating.append(individual_ride)

        # Se busca para los individual_rides que ha hecho como driver si existe una valoración del Passenger
        for individual_ride in driver_individual_rides:
            try:
                m.PassengerRating.objects.get(individual_ride=individual_ride)
            except m.PassengerRating.DoesNotExist:
                individual_rides_pending_for_rating.append(individual_ride)
        serializer = ListIndividualRideSerializer({"individual_rides":individual_rides_pending_for_rating})
        return JsonResponse(serializer.data)



        



class RatingList(APIView):
    def post(self, request):
        try:
            rating_type = request.data.get('rating_type')
            driver_id = int(request.data['driver'])
            passenger_id = int(request.data['passenger'])
            individual_ride_id = int(request.data['IndividualRide'])
            rating = float(request.data['rating'])
            comment = request.data['comment']
        except Exception as e:
            return JsonResponse({'error': 'Data not valid'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            individual_ride = m.IndividualRide.objects.get(pk=individual_ride_id)
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'Data not valid. The id\'s does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        if driver_id == passenger_id:
            return JsonResponse({'error': 'Data not valid. Same Driver and Passenger id'}, status=status.HTTP_400_BAD_REQUEST)
        if individual_ride.passenger.pk != passenger_id:
            return JsonResponse({'error': 'Data not valid. Passenger id does not match the IndividualRide passenger'}, status=status.HTTP_400_BAD_REQUEST)
        if individual_ride.ride.driver_routine.driver.pk != driver_id:
            return JsonResponse({'error': 'Data not valid. Driver id does not match the IndividualRide driver'}, status=status.HTTP_400_BAD_REQUEST)
      
        if rating_type == 'driver':
            serializer = DriverRatingSerializer(data={
                "individual_ride": individual_ride_id,
                "rating": rating,
                "comment": comment
            })
        
        elif rating_type == 'passenger':
            serializer = PassengerRatingSerializer(data={
                "individual_ride": individual_ride_id,
                "rating": rating,
                "comment": comment
            })
        else:
            return JsonResponse({'error': 'Invalid rating type. Options are "driver" and "passenger"'}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
           
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def get(self,request):
        if not request.data.get('userId'):
            return JsonResponse({'error': 'user_id is mandatory'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user_id = int(request.data['userId'])
        except ValueError as e:
            return JsonResponse({'error': 'user_id must be an integer'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            m.User.objects.get(pk=user_id)
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'user not found'}, status=status.HTTP_404_NOT_FOUND)
        
        driver_ratings = list(m.DriverRating.objects.filter(individual_ride__ride__driver_routine__driver__passenger__user__pk=user_id))
        passenger_ratings = list(m.PassengerRating.objects.filter(individual_ride__passenger__user__pk=user_id))
        serializer = ListRatingSelieaizer({"driver_rating":driver_ratings, "passenger_rating":passenger_ratings})
        return JsonResponse(serializer.data)


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
       
############## ENDPOINTS ASOCIADOS A ROUTINE_REQUEST

class RoutineRequest(APIView):
    def post(self,request):
        if request.method == 'POST':
            user = User.objects.get(id=request.data["userId"])
            passenger = Passenger.objects.get(user = user) 
            passenger_routine_qs = PassengerRoutine.objects.filter(passenger = passenger, days = request.data["day"]) 
            list_passenger_routine = list(passenger_routine_qs) # L-8 , L-10, L-19
            
            not_satisfied_passenger_routines = []
            for p_routine in list_passenger_routine:    # Se obtienen todos passenger routines no satisfechos por una routine_request
                routine_request = RoutineRequest.objects.get(passenger_routine = p_routine, acceptation_status = AcceptationStatus.Accepted)
                if routine_request == None:
                    not_satisfied_passenger_routines.append(p_routine)
            
            ride = Ride.objects.get(id = request.data["rideId"])
            driver_routine = ride.driver_routine
            day = driver_routine.days

            for passenger_routine in not_satisfied_passenger_routines:
                p_r = PassengerRoutine.objects.get(passenger_routine.start_time_initial <= ride.start_date <= passenger_routine.start_time_final)
                if p_r != None:
                    satisfied = True
                    break

            if satisfied == True:
                pass
            else:
                p_r = PassengerRoutine(
                    passenger = passenger,
                    start_location = driver_routine.start_location,
                    end_location = driver_routine.end_location,
                    days = day,
                    end_date = driver_routine.end_date,
                    start_time_initial = driver_routine.start_date,
                    start_time_final = driver_routine.start_date)
                p_r.save()

            rq = RoutineRequest(passenger_routine = p_r, driver_routine = driver_routine, day = day , acceptation_status = AcceptationStatus.Pending_Confirmation)
            rq.save()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'error': 'Invalid request method'})

############## ENDPOINTS ASOCIADOS A DRIVER

class Driver(APIView):
    def cancel_routine_request(self,request):
        try:
            routine_request = RoutineRequest.objects.get(id=request.data["idRoutineRequest"])
        except RoutineRequest.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'La instancia con el ID dado no existe'}, status=404)

        if request.method == 'PUT':
            routine_request.acceptation_status = AcceptationStatus.Cancelled
            routine_request.save()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'error': 'El método de solicitud no está permitido'}, status=405)