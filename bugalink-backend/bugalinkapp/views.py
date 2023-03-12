from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.core import serializers
from rest_framework.views import APIView
from bugalinkapp.models import *
from django.http import HttpResponse
from django.http import Http404


from rest_framework import serializers


class users(APIView):
    def get_user(self, request): 
        try:
            return User.objects.get(idUser = request.data['idUser'])
        except User.DoesNotExist:
            raise Http404
    
    def get_pending_individual_rides(self,request):
        try:
            return IndividualRide.objects.filter(user = User.objects.get(idUser=request.data['idUser']), status = 'P')
        except User.DoesNotExist:
            raise Http404
    
    def get_ongoing_individual_rides(self,request):
        try:
            return IndividualRide.objects.filter(user = User.objects.get(idUser=request.data['idUser']), status = 'O')
        except User.DoesNotExist:
            raise Http404
        
    def get_finished_individual_rides(self,request):
        try:
            return IndividualRide.objects.filter(user = User.objects.get(idUser=request.data['idUser']), status = 'F')
        except User.DoesNotExist:
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
            
            driver = Driver.objects.get(passenger_id = request.data['id'])
            driverRoutines = DriverRoutine.objects.filter(driver_id = driver.passenger)
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
            low_price = request.data['low_price']
            high_price = request.data['high_price']
            rating = request.data['rating']
        
            rides = list(Ride.objects.all())
            for ride in rides:
                # Filtramos por fecha
                # Ahora mismo la fecha tiene que ser exactamente la misma, pero podría hacerse más complejo en el futuro
                date_filter = date == ride.start_date.date
                
                # Filtramos por valoración
                driver = ride.driver_routine.driver # Tenemos que sacar al conductor para averiguar su valoración
                rating_filter = rating <= Rating.get_driver_rating(driver)
                
                # Si se han cumplido estos filtros, revisamos todos los viajes individuales de este viaje
                if (date_filter and rating_filter):
                    filteredIndividualRides = list(IndividualRide.objects.filter(ride_id = ride.id))
                    for individualRide in filteredIndividualRides:
                        # Y si el precio del viaje individual supera el filtro, lo añadimos a la lista que devolveremos
                        if low_price <= individualRide.price <= high_price:
                            individualRides.push(individualRide)
                            
            return individualRides
        except IndividualRide.DoesNotExist:
            raise Http404
        
    def put_individual_ride(self, request): 
        try:
            individual_ride = IndividualRide.objects.get(id = request.data['id_individual_ride'])
            acceptation_status = AcceptationStatus.Pending_Confirmation
            match request.data['acceptation_status']:
                case 'accept':
                    acceptation_status = AcceptationStatus.Accepted
                case 'cancel':
                    acceptation_status = AcceptationStatus.Cancelled
            individual_ride.acceptation_status = acceptation_status
            IndividualRide.objects.put(individual_ride)
        except IndividualRide.DoesNotExist:
            raise Http404
        
    """
    Por si se prefiere hacer uso de estas funciones
    """    
    
    def accept_individual_ride(self, request): 
        try:
            individual_ride = IndividualRide.objects.get(id = request.data['id_individual_ride'])
            individual_ride.acceptation_status = AcceptationStatus.Accepted
            IndividualRide.objects.put(individual_ride)
        except IndividualRide.DoesNotExist:
            raise Http404
        
    def cancel_individual_ride(self, request): 
        try:
            individual_ride = IndividualRide.objects.get(id = request.data['id_individual_ride'])
            individual_ride.acceptation_status = AcceptationStatus.Cancelled
            IndividualRide.objects.put(individual_ride)
        except IndividualRide.DoesNotExist:
            raise Http404