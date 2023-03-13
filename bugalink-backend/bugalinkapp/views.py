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