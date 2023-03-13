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
            lowPrice = request.data['low_price']
            highPrice = request.data['high_price']
            rating = request.data['rating']
        
            rides = list(Ride.objects.all())
            for ride in rides:
                # Filtramos por fecha
                # Hacemos que la fecha sea la misma. El criterio de filtrado puede cambiar en el futuro
                dateFilter = date == ride.start_date.date
                
                # Filtramos por valoración
                driver = ride.driver_routine.driver # Tenemos que sacar al conductor para averiguar su valoración
                ratingFilter = rating <= Rating.get_driver_rating(driver)
                
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
            individualRide = IndividualRide.objects.get(id = request.data['id_individual_ride'])
            acceptationStatus = AcceptationStatus.Pending_Confirmation
            match request.data['acceptation_status']:
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
            individualRide = IndividualRide.objects.get(id = request.data['id_individual_ride'])
            individualRide.acceptation_status = AcceptationStatus.Accepted
            IndividualRide.objects.put(individualRide)
        except IndividualRide.DoesNotExist:
            raise Http404
        
    def cancel_individual_ride(self, request): 
        try:
            individualRide = IndividualRide.objects.get(id = request.data['id_individual_ride'])
            individualRide.acceptation_status = AcceptationStatus.Cancelled
            IndividualRide.objects.put(individualRide)
        except IndividualRide.DoesNotExist:
            raise Http404