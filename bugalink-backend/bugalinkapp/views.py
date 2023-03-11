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
    
    def get_pending_individual_lifts(self,request):
        try:
            return IndividualLift.objects.filter(user = User.objects.get(idUser=request.data['idUser']), status = 'P')
        except User.DoesNotExist:
            raise Http404
    
    def get_ongoing_individual_lifts(self,request):
        try:
            return IndividualLift.objects.filter(user = User.objects.get(idUser=request.data['idUser']), status = 'O')
        except User.DoesNotExist:
            raise Http404
        
    def get_finished_individual_lifts(self,request):
        try:
            return IndividualLift.objects.filter(user = User.objects.get(idUser=request.data['idUser']), status = 'F')
        except User.DoesNotExist:
            raise Http404

class individualLifts(APIView):
    def get_individual_lift(self, request): 
        try:
            return IndividualLift.objects.get(id = request.data['idIndividualLift'])
        except IndividualLift.DoesNotExist:
            raise Http404
        
    def get_individual_lifts_driver(self, request): 
        try:
            individualLifts = []
            
            driver = Driver.objects.get(passenger_id = request.data['id'])
            driverRoutines = DriverRoutine.objects.filter(driver_id = driver.passenger)
            for driverRoutine in driverRoutines:
                lifts = list(Lift.objects.filter(driver_routine_id = driverRoutine.id))
                for lift in lifts:
                    individualLifts += list(IndividualLift.objects.filter(lift_id = lift.id))
            return individualLifts
        except IndividualLift.DoesNotExist:
            raise Http404
        
    def put_individual_lift(self, request): 
        try:
            individual_lift = IndividualLift.objects.get(id = request.data['id_individual_lift'])
            acceptation_status = AcceptationStatus.Pending_Confirmation
            match request.data['acceptation_status']:
                case 'accept':
                    acceptation_status = AcceptationStatus.Accepted
                case 'cancel':
                    acceptation_status = AcceptationStatus.Cancelled
            individual_lift.acceptation_status = acceptation_status
            IndividualLift.objects.put(individual_lift)
        except IndividualLift.DoesNotExist:
            raise Http404
        
    """
    Por si se prefiere hacer uso de estas funciones
    """    
    
    def accept_individual_lift(self, request): 
        try:
            individual_lift = IndividualLift.objects.get(id = request.data['id_individual_lift'])
            individual_lift.acceptation_status = AcceptationStatus.Accepted
            IndividualLift.objects.put(individual_lift)
        except IndividualLift.DoesNotExist:
            raise Http404
        
    def cancel_individual_lift(self, request): 
        try:
            individual_lift = IndividualLift.objects.get(id = request.data['id_individual_lift'])
            individual_lift.acceptation_status = AcceptationStatus.Cancelled
            IndividualLift.objects.put(individual_lift)
        except IndividualLift.DoesNotExist:
            raise Http404