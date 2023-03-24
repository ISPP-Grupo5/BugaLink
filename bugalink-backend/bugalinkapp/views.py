from datetime import *
from django.db import IntegrityError
from rest_framework import status
from rest_framework.views import APIView

from django.http import JsonResponse
from math import radians, sin, cos, atan2, sqrt

from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.core.exceptions import ObjectDoesNotExist

# Se importa como m para que no de conflictos con django.db.models
from . import models as m
from .serializers import *

# Imports que deberian desaparecer despues de la refactorización
from rest_framework import viewsets
from django.http import Http404
from rest_framework.response import Response

class Login(APIView):
    def post(self, request):
        username = request.data['username']
        password = request.data['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"message": "Login correcto"}, status = 200)
        else:
            return JsonResponse({"message": "usuario y/o contraseña incoorrectos"}, status = 400)

class Passengers(APIView):

    def get(self, request):
        try:
            user = m.Passenger.objects.get(user_id=request.data['userId'])
            serializer = PassengerSerializer(user, context={'request': request})
            return JsonResponse(serializer.data)
        except m.User.DoesNotExist:
            return JsonResponse({"message": "Not found"}, status=404)
        
# users /<userId> -> Devuelve la información del usuario
class Users(APIView):
    def get(self, request, user_id):
        try:
            user = m.User.objects.get(id=user_id)
            passenger = m.Passenger.objects.get(user=user)
            serializer = UserSerializer(user, context={'request': request})
            serializer_data = serializer.data
            serializer_data.update(PassengerSerializer(passenger, context={'request': request}).data)
            return JsonResponse(serializer_data)
        except m.User.DoesNotExist:
            return JsonResponse({"message": "Not found"}, status=404)


# users /<userId>/rides/total -> Devuelve el número total de viajes que ha hecho el usuario con BugaLink

class TotalRides(APIView):
    def get(self, request, user_id):
        try:
            total_rides = 0
            passenger = m.Passenger.objects.get(user_id=user_id)
            try:    # Count rides in case the user is also a driver
                driver = m.Driver.objects.get(passenger=passenger)
                driver_routines = list(m.DriverRoutine.objects.filter(driver=driver))
                for driver_routine in driver_routines:
                    rides = m.Ride.objects.filter(driver_routine=driver_routine).count()
                    total_rides += rides
            except:
                pass

            individual_rides = m.IndividualRide.objects.filter(passenger=passenger).count()
            total_rides += individual_rides
            json_data = {}
            json_data['total_rides'] = total_rides
            return JsonResponse(json_data)
        except m.User.DoesNotExist:
            return JsonResponse({"message": "Not found"}, status=404)

#GET* reviews/rating -> GET* Debe devolver: valoración (Double), el número de valoraciones(int) y devuelva nombre e imagen del usuario valorado
class Ratings(APIView):
    def get(self, request, user_id):
        try:
            rating = 0
            total_ratings = 0
            passenger = m.Passenger.objects.get(user_id=user_id)
            try:    # Count ratings in case the user is also a driver
                driver = m.Driver.objects.get(passenger=passenger)
                ratings_driver_rating = list(DriverRating.objects.all())
                for rating_dr in ratings_driver_rating:
                    if driver.passenger.user_id == rating_dr.individual_ride.ride.driver_routine.driver.passenger.user_id:
                        rating += rating_dr.rating
                        total_ratings +=1
            except:
                pass
            
            ratings_passenger_rating = list(PassengerRating.objects.all())
            for rating_pr in ratings_passenger_rating:
                    if passenger.user_id == rating_pr.individual_ride.passenger.user_id:
                        rating += rating_pr.rating
                        total_ratings +=1
            
            user = m.User.objects.get(id=user_id)

            json_data = {}
            json_data['rating'] = rating/total_ratings
            json_data['total_ratings'] = total_ratings
            json_data['profile_photo'] = str(passenger.photo)   #Mirar si esta bien así
            json_data['username'] = user.username
            return JsonResponse(json_data)
        except m.User.DoesNotExist:
            return JsonResponse({"message": "Not found"}, status=404)

class RoutineRecommendation(APIView):
    def get(self, request):
        try:
            # Definicion de parametros del passenger asociado al user que efectua el filtro
            driver_routines = m.DriverRoutine.objects.all()
            user = m.User.objects.get(id=request.data['userId'])
            passenger = m.Passenger.objects.get(user=user)
            passenger_routines = m.PassengerRoutine.objects.filter(
                passenger=passenger)
            
            for passenger_routine in passenger_routines:
                request = m.RoutineRequest.objects.filter(passenger_routine=passenger_routine).first()
                if request.acceptation_status != 'Accepted':
                    source_location = passenger_routine.start_location
                    destination_location = passenger_routine.end_location
                    min_time = passenger_routine.start_time_initial
                    max_time = passenger_routine.start_time_final
                    passenger_day = passenger_routine.day
                    valid_routines = []

                    for routine in driver_routines:
                        driver_day = routine.day

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
                        if passenger_day == driver_day and min_time <= drivers_beggining_of_ride and max_time >= drivers_beggining_of_ride and destination_distance <= 1 and source_distance <= 1:
                            valid_routines.append(routine)

                    # Se obtienen los viajes asociados a las rutinas marcadas como validas y se guardan a una lista que las devolvera como respuesta
                    rides = []
                    for routine in valid_routines:
                        ride = m.Ride.objects.filter(driver_routine=routine).first()
                        if ride and ride.num_seats > 0:
                            rides.append(ride)

                    # Llamada al serializer para devolver todos los viajes que han sido seleccionados
                    serializer = ListRideSerializer({"rides": rides})
                    return JsonResponse(serializer.data, status = 200)

        except Exception as e:
            return JsonResponse({"message": str(e)}, status=400)


class PendingIndividualRide(APIView):
    def get(self, request):
        try:
            user = m.User.objects.get(id=request.data['userId'])
            passenger = m.Passenger.objects.get(user=user)
            rides = m.IndividualRide.objects.filter(passenger=passenger, acceptation_status='Pending Confirmation')
            serializer = ListIndividualRideSerializer({'individual_rides': rides})
            return JsonResponse(serializer.data)
        except m.IndividualRide.DoesNotExist:
            raise Http404


class CancelledIndividualRide(APIView):
    def get(self, request):
        try:
            user = m.User.objects.get(id=request.data['userId'])
            passenger = m.Passenger.objects.get(user=user)
            rides = m.IndividualRide.objects.filter(passenger=passenger, acceptation_status='Cancelled')
            serializer = ListIndividualRideSerializer({'individual_rides': rides})
            return JsonResponse(serializer.data)
        except m.IndividualRide.DoesNotExist:
            raise Http404


class AcceptedIndividualRide(APIView):
    def get(self, request):
        try:
            user = m.User.objects.get(id=request.data['userId'])
            passenger = m.Passenger.objects.get(user=user)
            rides = m.IndividualRide.objects.filter(passenger=passenger, acceptation_status='Accepted')
            serializer = ListIndividualRideSerializer({'individual_rides': rides})
            return JsonResponse(serializer.data)
        except m.IndividualRide.DoesNotExist:
            raise Http404

    def get_sporadic_individual_rides(self, request):
        try:
            individual_ride = m.IndividualRide.objects.get(id=request.data['individualRideId'])
            return individual_ride.ride.driver_routine.one_ride
        except Exception as e:
            raise e


class IndividualRides(APIView):
    def get(self, request, individualRideId):
        try:
            individual_ride = m.IndividualRide.objects.get(id=individualRideId)
            serializer = IndividualRideSerializer(individual_ride)
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserIndividualRides(APIView):
    def get(self, request):
        try:
            individualRides = []
            user = m.User.objects.get(id=request.data['userId'])
            passenger = m.Passenger.objects.get(user=user)
            driver = m.Driver.objects.get(passenger=passenger)
            driverRoutines = m.DriverRoutine.objects.filter(driver=driver)
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
                ratingFilter = rating <= m.Passenger.get_driver_rating(driver)

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


class AcceptPassengerIndividualRide(APIView):
    def patch(self, request, individualRideId):
        try:
            individualRide = m.IndividualRide.objects.get(id=individualRideId)
            individualRide.acceptation_status = m.AcceptationStatus.Accepted
            individualRide.save()
            return JsonResponse({"message": "Viaje aceptado"}, status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({"message": str(e)}, status = status.HTTP_400_BAD_REQUEST)


class CancelPassengerIndividualRide:
    def put(self, request):
        try:
            individualRide = m.IndividualRide.objects.get(id=request.data['individualRideId'])
            individualRide.acceptation_status = m.AcceptationStatus.Cancelled
            m.IndividualRide.objects.put(individualRide)
        except m.IndividualRide.DoesNotExist:
            raise Http404


class AcceptRoutineRequest(APIView):

    def put(self, request):
        try:
            routineRequest = m.RoutineRequest.objects.get(id=request.data['routineRequestId'])
            routineRequest.acceptation_status = m.AcceptationStatus.Accepted
            m.RoutineRequest.objects.put(routineRequest)
        except m.IndividualRide.DoesNotExist:
            raise Http404


class CancelRoutineRequest(APIView):

    def put(self, request):
        try:
            routineRequest = m.RoutineRequest.objects.get(id=request.data['routineRequestId'])
            routineRequest.acceptation_status = m.AcceptationStatus.Cancelled
            m.RoutineRequest.objects.put(routineRequest)
        except m.IndividualRide.DoesNotExist:
            raise Http404


class CancelIndividualRide(APIView):
    def post(self, request):
        try:
            indiviudal_ride = m.IndividualRide.objects.get(id=request.data["individualRideId"])
        except m.IndividualRide.DoesNotExist:
            return JsonResponse({'error': 'Ride not found'}, status=404)

        diff = datetime.datetime.now() - indiviudal_ride.start_date
        if diff.total_seconds() < 86400:  # Si quedan menos de 24 horas para el viaje
            return JsonResponse({'error': 'Cancelation deadline has passed'}, status=400)

        indiviudal_ride.delete()
        return JsonResponse({'success': True})


############## ENDPOINTS ASOCIADOS A RIDE

class RideSearch(APIView):
    def post(self, request):
        try:
            resultRides = []

            date = datetime.strptime(request.data['date'], '%Y-%m-%d %H:%M').date()
            lowPrice = request.data['lowPrice']
            highPrice = request.data['highPrice']
            rating = request.data['rating']

            
            for ride in m.Ride.objects.all():
                # Filtramos por fecha
                # Hacemos que la fecha sea la misma. El criterio de filtrado puede cambiar en el futuro
                dateFilter = date == ride.start_date.date()

                # Filtramos por valoración
                driver = ride.driver_routine.driver  # Tenemos que sacar al conductor para averiguar su valoración
                ratingFilter = float(rating) <= m.Passenger.get_driver_rating(driver)
                free_seats = ride.num_seats
                price = ride.driver_routine.price
                # Si se han cumplido estos filtros, revisamos todos los viajes individuales de este viaje
                if dateFilter and ratingFilter and free_seats > 0 and float(lowPrice) <= price and float(highPrice) >= price:
                    resultRides.append(ride)
            serializer = ListRideSerializer({"rides": resultRides})

            return JsonResponse(serializer.data, status = status.HTTP_200_OK)
        except Exception as e:
            print('EL ERROR ' + str(e))
            return JsonResponse({"message": str(e)}, status = status.HTTP_400_BAD_REQUEST)


class CreateIndividualRide(APIView):
    def post(self, request):
        if request.method == 'POST':
            user = User.objects.get(id=request.data["userId"])
            passenger = m.Passenger.objects.get(user=user)
            ride = m.Ride.objects.get(id=request.data["rideId"])
            driver_routine = ride.driver_routine
            day = driver_routine.days

            passenger_routine_qs = m.PassengerRoutine.objects.filter(passenger=passenger, days=request.data["day"])
            list_passenger_routine = list(passenger_routine_qs)  # L-8 , L-10, L-19

            not_satisfied_passenger_routines = []
            for p_routine in list_passenger_routine:  # Se obtienen todos passenger routines no satisfechos por una routine_request
                routine_request = m.RoutineRequest.objects.get(passenger_routine=p_routine,
                                                             acceptation_status=m.AcceptationStatus.Accepted)
                if routine_request == None:
                    not_satisfied_passenger_routines.append(p_routine)

            for passenger_routine in not_satisfied_passenger_routines:
                p_r = PassengerRoutine.objects.get(
                    passenger_routine.start_time_initial <= ride.start_date <= passenger_routine.start_time_final)
                if p_r != None:
                    satisfied = True
                    break

            if satisfied == True:
                passenger_routine = p_r
            else:
                passenger_routine = m.PassengerRoutine(
                    passenger=passenger,
                    start_location=driver_routine.start_location,
                    end_location=driver_routine.end_location,
                    days=day,
                    end_date=driver_routine.end_date,
                    start_time_initial=driver_routine.start_date,
                    start_time_final=driver_routine.start_date)
                passenger_routine.save()

            i_r = m.IndividualRide(ride=ride,
                                 passenger=passenger,
                                 passenger_routine=passenger_routine,
                                 price=0,  # TODO Pendiente de revisión
                                 ride_status=m.RideStatus.Pending_start,
                                 acceptation_status=m.AcceptationStatus.Pending_Confirmation,
                                 start_date=ride.start_date,
                                 end_date=ride.end_date,
                                 start_location=ride.start_location,
                                 end_location=ride.end_location,
                                 message=request.data["message"]
                                 )
            i_r.save()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'error': 'Invalid request method'})


class PendingRoutineRequests(APIView):
    def get(self, request):
        try:
            user = m.User.objects.get(id=request.data['userId'])
            passenger = m.Passenger.objects.get(user=user)
            routines = m.PassengerRoutine.objects.filter(passenger=passenger)
            routineRequests = []
            for routine in routines:
                routineRequests += m.RoutineRequest.objects.filter(passenger_routine=routine,
                                                                   acceptation_status='Pending Confirmation')
            driver = m.Driver.objects.get(passenger=passenger)
            routines = m.DriverRoutine.objects.filter(driver=driver)
            for routine in routines:
                routineRequests += m.RoutineRequest.objects.filter(driver_routine=routine,
                                                                   acceptation_status='Pending Confirmation')
            serializer = ListRoutineRequestSerializer({'routineRequests': routineRequests})
            return JsonResponse(serializer.data)
        except m.IndividualRide.DoesNotExist:
            raise Http404


class AcceptedRoutineRequests(APIView):
    def get(self, request):
        try:
            user = m.User.objects.get(id=request.data['userId'])
            passenger = m.Passenger.objects.get(user=user)
            routines = m.PassengerRoutine.objects.filter(passenger=passenger)
            routineRequests = []
            for routine in routines:
                routineRequests += m.RoutineRequest.objects.filter(passenger_routine=routine,
                                                                   acceptation_status='Accepted')
            driver = m.Driver.objects.get(passenger=passenger)
            routines = m.DriverRoutine.objects.filter(driver=driver)
            for routine in routines:
                routineRequests += m.RoutineRequest.objects.filter(driver_routine=routine,
                                                                   acceptation_status='Accepted')
            serializer = ListRoutineRequestSerializer({'routineRequests': routineRequests})
            return JsonResponse(serializer.data)
        except m.IndividualRide.DoesNotExist:
            raise Http404


class CanceledRoutineRequests(APIView):
    def get(self, request):
        try:
            user = m.User.objects.get(id=request.data['userId'])
            passenger = m.Passenger.objects.get(user=user)
            routines = m.PassengerRoutine.objects.filter(passenger=passenger)
            routineRequests = []
            for routine in routines:
                routineRequests += m.RoutineRequest.objects.filter(passenger_routine=routine,
                                                                   acceptation_status='Canceled')
            driver = m.Driver.objects.get(passenger=passenger)
            routines = m.DriverRoutine.objects.filter(driver=driver)
            for routine in routines:
                routineRequests += m.RoutineRequest.objects.filter(driver_routine=routine,
                                                                   acceptation_status='Canceled')
            serializer = ListRoutineRequestSerializer({'routineRequests': routineRequests})
            return JsonResponse(serializer.data)
        except m.IndividualRide.DoesNotExist:
            raise Http404


class Rating(APIView):
    def get(self, request):
        user_id = request.data.get('userId')
        if not user_id:
            return JsonResponse({'error': 'userId not provided'}, status=status.HTTP_400_BAD_REQUEST)

        driver_rating_list = []
        passenger_rating_list = []
        try:
            driver_rating_list = list(m.DriverRating.objects.filter(
                individual_ride__ride__driver_routine__driver__passenger__user__pk=user_id))
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
        if len(numeric_driver_rating_list) > 0 or len(numeric_passenger_rating_list) > 0:
            rating = (sum(numeric_driver_rating_list) + sum(numeric_passenger_rating_list)) / (
                    len(numeric_passenger_rating_list) + len(numeric_driver_rating_list))
        else:
            rating = 0
        data = {
            "passenger": passenger_serializer.data,
            "rating": rating
        }
        return JsonResponse(data)


class PendingRatings(APIView):
    def get(self, request):
        user_id = request.data.get('userId')
        # comprobaciones varias
        if not user_id:
            return JsonResponse({'error': 'userId not provided'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user_id = int(user_id)
        except ValueError:
            return JsonResponse({'error': 'userId must be int'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            passenger = m.Passenger.objects.get(user_id=user_id)
        except m.Passenger.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        try:
            passenger_individual_rides = list(
                m.IndividualRide.objects.filter(passenger__user__pk=user_id, ride__status="Finished"))
        except Exception:
            pass
        try:
            driver_individual_rides = list(
                m.IndividualRide.objects.filter(ride__driver_routine__driver__passenger__user__pk=user_id,
                                                ride__status="Finished"))
        except Exception:
            pass

        # Se busca para los individual_rides que ha hecho como passenger si existe una valoración del Driver
        individual_rides_pending_for_rating = []
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
        serializer = ListIndividualRideSerializer({"individual_rides": individual_rides_pending_for_rating})
        return JsonResponse(serializer.data)


class RatingList(APIView):
    def post(self, request):
        try:
            rating_type = request.data.get('rating_type')
            driver_id = int(request.data['driverId'])
            passenger_id = int(request.data['passengerId'])
            individual_ride_id = int(request.data['individualRideId'])
            rating = float(request.data['rating'])
            comment = request.data['comment']
        except Exception as e:
            return JsonResponse({'error': 'Data not valid'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            individual_ride = m.IndividualRide.objects.get(pk=individual_ride_id)
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'Data not valid. The id\'s does not exist'},
                                status=status.HTTP_400_BAD_REQUEST)
        if driver_id == passenger_id:
            return JsonResponse({'error': 'Data not valid. Same Driver and Passenger id'},
                                status=status.HTTP_400_BAD_REQUEST)
        if individual_ride.passenger.pk != passenger_id:
            return JsonResponse({'error': 'Data not valid. Passenger id does not match the IndividualRide passenger'},
                                status=status.HTTP_400_BAD_REQUEST)
        if individual_ride.ride.driver_routine.driver.pk != driver_id:
            return JsonResponse({'error': 'Data not valid. Driver id does not match the IndividualRide driver'},
                                status=status.HTTP_400_BAD_REQUEST)

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
            return JsonResponse({'error': 'Invalid rating type. Options are "driver" and "passenger"'},
                                status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        if not request.data.get('userId'):
            return JsonResponse({'error': 'userId is mandatory'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user_id = int(request.data['userId'])
        except ValueError as e:
            return JsonResponse({'error': 'userId must be an integer'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            m.User.objects.get(pk=user_id)
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'user not found'}, status=status.HTTP_404_NOT_FOUND)

        driver_ratings = list(
            m.DriverRating.objects.filter(individual_ride__ride__driver_routine__driver__passenger__user__pk=user_id))
        passenger_ratings = list(m.PassengerRating.objects.filter(individual_ride__passenger__user__pk=user_id))
        serializer = ListRatingSelieaizer({"driver_rating": driver_ratings, "passenger_rating": passenger_ratings})
        return JsonResponse(serializer.data)


class Rides(APIView):
    def get(self, request, format=None):
        try:
            ride = m.Ride.objects.get(pk=request.data['rideId'])
            serializer = RideSerializer(ride, many=False)
            return JsonResponse(serializer.data)
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'Ride does not exists'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, format=None):
        request.data['status'] = m.RideStatus.Pending_start
        request.data['driver_routine_id'] = request.data['driverRoutineId']
        request.data['vehicle_id'] = request.data['vehicleId']
        del request.data['vehicleId']
        del request.data['driverRoutineId']
        try:
            serializer = RideSerializer(data=request.data, many=False)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)
            else:
                return JsonResponse({'error': 'Provided data is not valid'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            raise e

class PassengerRoutineList(APIView):
    def get(self, request, format=None):
        try:
            queryset = m.PassengerRoutine.objects.filter(passenger_id=request.data['passengerId'])
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'Passenger does not exist with id {}'.format(request.data['passengerId'])},
                                status=status.HTTP_400_BAD_REQUEST)
        serializer = ListPassengerRoutineSerializer({"passenger_routines": queryset})
        return JsonResponse(serializer.data)


class DriverRoutineList(APIView):
    def get(self, request, format=None):
        try:
            queryset = m.DriverRoutine.objects.filter(driver_id=request.data['driverId'])
            serializer = ListDriverRoutineSerializer({"driver_routines": queryset})
            return JsonResponse(serializer.data)
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'Passenger does not exist with id {}'.format(request.data['driverId'])},
                                status=status.HTTP_400_BAD_REQUEST)


class PassengerRoutine(APIView):
    def get(self, request, passenger_routine_id, format=None):
        try:
            routine = m.PassengerRoutine.objects.get(pk=passenger_routine_id)
            serializer = PassengerRoutineSerializer(routine, context={'request': request})
            return JsonResponse(serializer.data)
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'PassengerRoutine does not exist with id {}'.format(passenger_routine_id)},
                                status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, format=None):
        try:
            routine = m.PassengerRoutine.objects.get(pk=request.data['passengerRoutineId'])
        except ObjectDoesNotExist:
            return JsonResponse(
                {'error': 'PassengerRoutine does not exist with id {}'.format(request.data['passengerRoutineId'])},
                status=status.HTTP_400_BAD_REQUEST)
        routine.delete()
        return JsonResponse({'message': 'Success'})

    def post(self, request, format=None):  # POST de creacion de la routina
        try:
            serializer = PassengerRoutineSerializer(data=request.data, many=False)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)
            else:
                return JsonResponse({'error': 'Provided data is not valid'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return JsonResponse({'error': 'Unexpected error'})

    def put(self, request,passenger_routine_id, format=None):
        try:
            routine = m.PassengerRoutine.objects.get(pk=passenger_routine_id)
            for key, value in request.data.items():
                setattr(routine, key, value)
            routine.save()
            serializer = PassengerRoutineSerializer(routine, context={'request': request})
            return JsonResponse(serializer.data,status= 201)
        except ObjectDoesNotExist:
            return JsonResponse(
                {'error': 'PassengerRoutine does not exist with id {}'.format(passenger_routine_id)},
                status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return JsonResponse({'error': 'Invalid arguments'}, status=status.HTTP_400_BAD_REQUEST)


class DriverRoutine(APIView):
    def get(self, request, driver_routine_id, format=None):
        try:
            routine = m.DriverRoutine.objects.get(pk=driver_routine_id)
            serializer = DriverRoutineSerializer(routine, context={'request': request})
            return JsonResponse(serializer.data)
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'DriverRoutine does not exist with id {}'.format(driver_routine_id)},
                                status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, format=None):
        try:
            routine = m.DriverRoutine.objects.get(pk=request.data['driverRoutineId'])
        except ObjectDoesNotExist:
            return JsonResponse(
                {'error': 'DriverRoutine does not exist with id {}'.format(request.data['passengerRoutineId'])},
                status=status.HTTP_400_BAD_REQUEST)

        routine.delete()
        return JsonResponse({'message': 'Success'})

    def put(self, request, driver_routine_id, format=None):
        try:
            routine = m.DriverRoutine.objects.get(pk=driver_routine_id)
            for key, value in request.data.items():
                setattr(routine, key, value)
            routine.save()
            serializer = DriverRoutineSerializer(routine, context={'request': request})
            return JsonResponse(serializer.data,status= 201)
        except ObjectDoesNotExist:
            return JsonResponse(
                {'error': 'DriverRoutine does not exist with id {}'.format(driver_routine_id)},
                status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return JsonResponse({'error': 'Invalid arguments'}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, format=None):  # POST de creacion de la routina
        try:
            serializer = DriverRoutineSerializer(data=request.data, many=False)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)
            else:
                return JsonResponse({'error': 'Provided data is not valid'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return JsonResponse({'error': 'Unexpected error'})
    ############## ENDPOINTS ASOCIADOS A ROUTINE_REQUEST


class RoutineRequest(APIView):
    def post(self, request):
        if request.method == 'POST':
            user = m.User.objects.get(id=request.data["userId"])
            passenger = m.Passenger.objects.get(user=user)
            passenger_routine_qs = m.PassengerRoutine.objects.filter(passenger=passenger, days=request.data["day"])
            list_passenger_routine = list(passenger_routine_qs)  # L-8 , L-10, L-19

            not_satisfied_passenger_routines = []
            for p_routine in list_passenger_routine:  # Se obtienen todos passenger routines no satisfechos por una routine_request
                routine_request = m.RoutineRequest.objects.get(passenger_routine=p_routine,
                                                             acceptation_status=m.AcceptationStatus.Accepted)
                if routine_request == None:
                    not_satisfied_passenger_routines.append(p_routine)

            ride = m.Ride.objects.get(id=request.data["rideId"])
            driver_routine = ride.driver_routine
            day = driver_routine.days

            for passenger_routine in not_satisfied_passenger_routines:
                p_r = m.PassengerRoutine.objects.get(
                    passenger_routine.start_time_initial <= ride.start_date <= passenger_routine.start_time_final)
                if p_r != None:
                    satisfied = True
                    break

            if satisfied == True:
                pass
            else:
                p_r = m.PassengerRoutine(
                    passenger=passenger,
                    start_location=driver_routine.start_location,
                    end_location=driver_routine.end_location,
                    days=day,
                    end_date=driver_routine.end_date,
                    start_time_initial=driver_routine.start_date,
                    start_time_final=driver_routine.start_date)
                p_r.save()

            rq = m.RoutineRequest(passenger_routine=p_r, driver_routine=driver_routine, day=day,
                                acceptation_status=m.AcceptationStatus.Pending_Confirmation)
            rq.save()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'error': 'Invalid request method'})


############## ENDPOINTS ASOCIADOS A DRIVER

class Driver(APIView):
    def cancel_routine_request(self, request):
        try:
            routine_request = m.RoutineRequest.objects.get(id=request.data["routineRequestId"])
        except m.RoutineRequest.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'La instancia con el ID dado no existe'}, status=404)

        if request.method == 'PUT':
            routine_request.acceptation_status = m.AcceptationStatus.Cancelled
            routine_request.save()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'error': 'El método de solicitud no está permitido'}, status=405)


class UsersTest(APIView):
    def get(self, request, userId):
        try:
            user = m.Passenger.objects.get(user_id=userId)
            serializer = PassengerSerializer(user, context={'request': request})
            return JsonResponse(serializer.data)
        except m.Passenger.DoesNotExist:
            return JsonResponse({"message": "Not found"}, status=404)
        
    def put(self, request, userId):
        try:
            passenger = m.Passenger.objects.get(user_id=userId)
            user = passenger.user
            if request.data.get('photo'):
                passenger.photo = request.data.get('photo')
            if request.data.get('firstName'):
                user.first_name = request.data.get('firstName')
            if request.data.get('lastName'):
                user.last_name = request.data.get('lastName')
            if request.data.get('password'):
                user.set_password(request.data.get('password'))
            passenger.save()
            user.save()
            serializer = UserSerializer(user)
            return JsonResponse(serializer.data,status= 201)
        except m.User.DoesNotExist:
             return JsonResponse({"message": "Not found"}, status=404)
        
    def delete(self,request, userId):
        try:
            user = m.User.objects.get(pk=userId)
            user.delete()
            return Response(status=204)
        except m.User.DoesNotExist:
            return JsonResponse({"error":"User not found"}, status=404)

            


class RatingListTest(APIView):
    def post(self, request):
        try:
            rating_type = request.data.get('rating_type')
            driver_id = int(request.data['driverId'])
            passenger_id = int(request.data['passengerId'])
            individual_ride_id = int(request.data['individualRideId'])
            rating = float(request.data['rating'])
            preference_0 = request.data['preference0']
            preference_1 = request.data['preference1']
            preference_2 = request.data['preference2']
        except Exception as e:
            return JsonResponse({'error': 'Data not valid'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            individual_ride = m.IndividualRide.objects.get(pk=individual_ride_id)
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'Data not valid. The id\'s does not exist'},
                                status=status.HTTP_400_BAD_REQUEST)
        if driver_id == passenger_id:
            return JsonResponse({'error': 'Data not valid. Same Driver and Passenger id'},
                                status=status.HTTP_400_BAD_REQUEST)
        if individual_ride.passenger.pk != passenger_id:
            return JsonResponse({'error': 'Data not valid. Passenger id does not match the IndividualRide passenger'},
                                status=status.HTTP_400_BAD_REQUEST)
        if individual_ride.ride.driver_routine.driver.pk != driver_id:
            return JsonResponse({'error': 'Data not valid. Driver id does not match the IndividualRide driver'},
                                status=status.HTTP_400_BAD_REQUEST)

        data = {
                "individual_ride": individual_ride_id,
                "rating": rating,
                "preference_0": preference_0,
                "preference_1": preference_1,
                "preference_2": preference_2,
            }
        if rating_type == 'driver':
            serializer = DriverRatingSerializer(data=data)

        elif rating_type == 'passenger':
            serializer = PassengerRatingSerializer(data=data)
        else:
            return JsonResponse({'error': 'Invalid rating type. Options are "driver" and "passenger"'},
                                status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class CancelRoutineRequestTest(APIView):
    def put(self, request, routineRequestId):
        try:
            routineRequest = m.RoutineRequest.objects.get(id=routineRequestId)
            routineRequest.acceptation_status = m.AcceptationStatus.Cancelled
            m.RoutineRequest.objects.put(routineRequest)
        except m.IndividualRide.DoesNotExist:
            raise Http404

# PUT users/<int:user_id>/driver/docs -> Se sube la documentación.
# Cada solicitud hace el post de un documento y un atributo para identificar que documento es.

class UploadDocsDriver(APIView):
    def put(self, request, user_id):
        try:
            passenger = m.Passenger.objects.get(user_id = user_id)
            driver = m.Driver.objects.get(passenger = passenger)
            try:
                sworn_declaration = request.data['sworn_declaration']
                driver.sworn_declaration = sworn_declaration
                driver.sworn_declaration_status = m.DocumentValidationStatus.Waiting_Validation
            except:
                pass
            try:
                driver_license = request.data['driver_license']
                driver.driver_license = driver_license
                driver.driver_license = m.DocumentValidationStatus.Waiting_Validation
            except:
                pass
            try:
                dni_front = request.data['dni_front']
                driver.dni_front = dni_front
                driver.dni_front = m.DocumentValidationStatus.Waiting_Validation
            except:
                pass
            try:
                dni_back = request.data['dni_back']
                driver.dni_back = dni_back
                driver.dni_back = m.DocumentValidationStatus.Waiting_Validation
            except:
                pass
            driver.save()
            serializer = DriverSerializer(driver)
            return JsonResponse(serializer.data,status= 201)
        
        except Exception as e:
            return JsonResponse({"message": str(e)}, status = status.HTTP_400_BAD_REQUEST)
