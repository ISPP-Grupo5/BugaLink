from rest_framework import status
from rest_framework.views import APIView

from django.http import JsonResponse
from math import radians, sin, cos, atan2, sqrt

from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist

from .models import *
from .serializers import *

from django.contrib.auth.decorators import login_required
from django.db import IntegrityError


#Imports que deberian desaparecer despues de la refactorización
from rest_framework import viewsets
from django.http import Http404
from rest_framework.response import Response

############## ENDPOINTS ASOCIADOS A USUARIOS

class Users(APIView):
    #Obtener un usuario dado el id
    def get(self, request,id): 
        try:
            user = User.objects.get(id=id)
            serializer = UserSerializer(user, context={'request': request})
            return JsonResponse(serializer.data)
        except User.DoesNotExist:
            return JsonResponse({"message":"Not found"},status=404)
    
    #Creacion inicial de usuario
    def post(self, request):
        try:
            print(request.data)
            email = request.data['email']
            nickname = request.data['nickname']
            password = request.data['password']
            birth_date = request.data['birth_date']
            balance = request.data['balance']
            newUser = User.objects.create(email=email, username=nickname)
            print("usuario creado")
            newUser.set_password(password)
            print("contraseña cambiada")
            newUser.save()
            newPassenger = Passenger.objects.create(user=newUser, birth_date=birth_date, balance=balance)
            newPassenger.save()    
            return JsonResponse({"message":"User Created Succesfully"}, status = 200)
        except IntegrityError as e:
            print("Error de integridad al crear el usuario:", e)
            return JsonResponse({"message":"No se pudo registrar el usuario."}, status = 400)
        except Exception as e:
            print("Error al crear el usuario:", e)
            return JsonResponse({"message":"No se pudo registrar el usuario."}, status = 400)
    #Editar usuario desde el perfil
    def patch(self,request):
        user = User.objects.get(id=request.data['id'])
        passenger = Passenger.objects.get(user=user)
        if "email" in request.data:
            try:
                user.email = request.data['email']
            except:
                return JsonResponse({"message":"Incorrect email"}, status = 400)        
        if "name" in request.data:
            try:
                user.first_name = request.data['first_name']
            except:
                return JsonResponse({"message":"Incorrect first name"}, status = 400)        
        if "last_name" in request.data:
            try:
                user.last_name = request.data['last_name']
            except:
                return JsonResponse({"message":"Incorrect last name"}, status = 400)        
        user.save()
        if "biography" in request.data:
            try:
                passenger.biography = request.data['biography']
            except:
                return JsonResponse({"message":"Incorrect biography"}, status = 400)        
        if "city" in request.data:
            try:
                passenger.city = request.data['city']
            except:
                return JsonResponse({"message":"Incorrect city"}, status = 400)
        if "province" in request.data:
            try:
                passenger.province = request.data['province']
            except:
                return JsonResponse({"message":"Incorrect province"}, status = 400)
        if "birth_date" in request.data:
            try:
                passenger.birth_date = request.data['birth_date']
            except:
                return JsonResponse({"message":"Incorrect birth date"}, status = 400)
        if "balance" in request.data:
            try:
                passenger.balance = request.data['balance']
            except:
                return JsonResponse({"message":"Incorrect balance"}, status = 400)
        passenger.save()
        return JsonResponse({"message":"User updated succesfully"}, status = 200)

############## ENDPOINTS ASOCIADOS A INDIVIDUAL_RIDE

class pendingIndividualRide(APIView):
    def get(self, request):
        try:
            user = User.objects.get(id=request.data['id'])
            passenger = Passenger.objects.get(user=user)
            rides = IndividualRide.objects.filter(passenger=passenger, acceptation_status='Pending Confirmation')
            serializer = ListaIndividualRideSerializer({'rides': rides})
            return JsonResponse(serializer.data, status = 200)
        except IndividualRide.DoesNotExist:
            return JsonResponse({"message":"NotFound"}, status = 404)

class cancelledIndividualRide(APIView):
    def get(self, request):
        try:
            user = User.objects.get(id=request.data['id'])
            passenger = Passenger.objects.get(user=user)
            rides = IndividualRide.objects.filter(passenger=passenger, acceptation_status='Cancelled')
            serializer = ListaIndividualRideSerializer(rides, many=True)
            return JsonResponse(serializer.data, status = 200)
        except IndividualRide.DoesNotExist:
            return JsonResponse({"message":"NotFound"}, status = 404)

class acceptedIndividualRide(APIView):
    def get(self, request):
        try:
            user = User.objects.get(id=request.data['id'])
            passenger = Passenger.objects.get(user=user)
            rides = IndividualRide.objects.filter(passenger=passenger, acceptation_status='Accepted')
            serializer = ListaIndividualRideSerializer(rides, many=True)
            return JsonResponse(serializer.data, status = 200)
        except IndividualRide.DoesNotExist:
            return JsonResponse({"message":"NotFound"}, status = 404)

class IndividualRides(APIView): 
    def get_individual_ride(self, request):
        try:
            return IndividualRide.objects.get(id=request.data['idIndividualRide'])
        except IndividualRide.DoesNotExist:
            raise Http404
    
    # Estos endpoints no estan en urls.py

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

    def put_individual_ride(self, request):     # TODO MIRAR ESTE ENDPOINT NO HACE NADA
        try:
            individualRide = IndividualRide.objects.get(id=request.data['idIndividualRide'])
            '''
            acceptationStatus = AcceptationStatus.Pending_Confirmation
            match request.data['acceptationStatus']:
                case 'accept':
                    acceptationStatus = AcceptationStatus.Accepted
                case 'cancel':
                    acceptationStatus = AcceptationStatus.Cancelled
            individualRide.acceptation_status = acceptationStatus
            '''
            IndividualRide.objects.put(individualRide)
        except IndividualRide.DoesNotExist:
            raise Http404

    def accept_individual_ride(self, request):  # MIRAR API PARA SU URL.PY
        try:
            individualRide = IndividualRide.objects.get(id=request.data['idIndividualRide'])
            individualRide.acceptation_status = AcceptationStatus.Accepted
            IndividualRide.objects.put(individualRide)
        except IndividualRide.DoesNotExist:
            raise Http404

    def cancel_individual_ride(self, request):  # MIRAR API PARA SU URL.PY
        try:
            individualRide = IndividualRide.objects.get(id=request.data['idIndividualRide'])
            individualRide.acceptation_status = AcceptationStatus.Cancelled
            IndividualRide.objects.put(individualRide)
        except IndividualRide.DoesNotExist:
            raise Http404

    def get_sporadic_individual_rides(self, request):
            try:
                individual_ride = IndividualRide.objects.get(idIndividualRide=request.data['idIndividualRide'])
                return individual_ride.ride.driver_routine.one_ride
            except Exception as e:
                raise e

############## ENDPOINTS ASOCIADOS A RIDE

class Rides(APIView):
    def get(self, request, pk, format=None):    # TODO Cambiar segun la guia
        ride_id = pk
        try:
            ride = Ride.objects.get(pk=ride_id)
            serializer = RideSerializer(ride, many=False)
            return Response(serializer.data)
        except ObjectDoesNotExist as e:
            return Response({'error': 'Ride does not exists'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, pk, format=None):   # TODO Cambiar segun la guia
        request.data['status'] = RideStatus.Pending_start
        request.data['pk'] = pk
        try:
            serializer = RideSerializer(request.data, many=False)
            serializer.save()
            return Response(serializer.data)
        except:
            return Response({'error': 'Ride already exists with id {}'.format(pk)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

############## ENDPOINTS ASOCIADOS A RATINGS

class RatingViewSet(viewsets.ModelViewSet): # TODO Cambiar segun la guia viewsets.ModelViewSet?
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

############## ENDPOINTS ASOCIADOS A DRIVER_ROUTINE

class DriverRoutineList(APIView): 
    def get(self, request, pk, format=None): # TODO Cambiar segun la guia
        try:
            queryset = DriverRoutine.objects.filter(driver_id=pk)
        except:
            return Response({'error': 'Passenger does not exist with id {}'.format(pk)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        serializer = DriverRoutineSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, pk, format=None):  # TODO Cambiar segun la guia
        request.data['driver_id'] = pk
        try:
            serializer = DriverRoutineSerializer(request.data, many=False)
            serializer.save()
        except:
            return Response({'error': ''})

class DriverRoutineDelete(APIView):
    def delete(self, request, user_id, routine_id, format=None): # TODO Cambiar segun la guia
        try:
            routine = DriverRoutine.objects.get(pk=routine_id)
        except:
            return Response({'error': 'DriverRoutine does not exist with id {}'.format(routine_id)})

        serializer = DriverRoutineSerializer(routine, many=False)
        return Response(serializer.data)

    def put(self, request, user_id, routine_id, format=None): # TODO Cambiar segun la guia
        try:
            routine = DriverRoutine.objects.get(pk=routine_id)
        except:
            return Response({'error': 'DriverRoutine does not exist with id {}'.format(routine_id)})
        try:
            routine.update(**request.data)
        except:
            return Response({'error': 'Invalid arguments'}, status=status.HTTP_400_BAD_REQUEST)
        
############## ENDPOINTS ASOCIADOS A PASSENGER_ROUTINE

class PassengerRoutineList(APIView):
    def get(self, request, pk, format=None): # TODO Cambiar segun la guia
        try:
            queryset = PassengerRoutine.objects.filter(passennger_id=pk)
        except:
            return Response({'error': 'Passenger does not exist with id {}'.format(pk)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        serializer = PassengerRoutineSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, pk, format=None):  # TODO Cambiar segun la guia
        request.data['passenger_id'] = pk
        try:
            serializer = PassengerRoutineSerializer(request.data, many=False)
            serializer.save()
        except:
            return Response({'error': ''})

class PassengerRoutineDelete(APIView):
    def delete(self, request, user_id, routine_id, format=None): # TODO Cambiar segun la guia
        try:
            routine = PassengerRoutine.objects.get(pk=routine_id)
        except:
            return Response({'error': 'PassengerRoutine does not exist with id {}'.format(routine_id)})

        serializer = PassengerRoutineSerializer(routine, many=False)
        return Response(serializer.data)
    
    def put(self, request, user_id, routine_id, format=None): # TODO Cambiar segun la guia
        try:
            routine = PassengerRoutine.objects.get(pk=routine_id)
        except:
            return Response({'error': 'PassengerRoutine does not exist with id {}'.format(routine_id)})
        try:
            routine.update(**request.data)
        except:
            return Response({'error': 'Invalid arguments'}, status=status.HTTP_400_BAD_REQUEST)

############## ENDPOINTS ASOCIADOS A ROUTINE_RECOMMENDATION

class RoutineRecommendation(APIView):             
    def get(self, request):
        try:
            #Definicion de parametros del passenger asociado al user que efectua el filtro
            driver_routines = DriverRoutine.objects.all()
            user = User.objects.get(id=request.data['id'])
            passenger = Passenger.objects.get(user=user)
            passenger_routine = PassengerRoutine.objects.get(
                passenger=passenger)
            source_location = passenger_routine.start_location
            destination_location = passenger_routine.end_location
            min_time = passenger_routine.start_time_initial
            max_time = passenger_routine.start_time_final
            passenger_days = passenger_routine.days

            valid_routines = []
            similar_days = []

            for routine in driver_routines:
                driver_days = routine.days

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
                ride = Ride.objects.filter(driver_routine=routine).first()
                if ride:
                    if ride.num_seats > 0:
                        rides.append(ride)
            
            #Llamada al serializer para devolver todos los viajes que han sido seleccionados
            serializer = ListRideSerializer(rides, many=True)
            return Response(serializer.data)
            
        except:
            raise Http404 #Mejorar errores
       
    



