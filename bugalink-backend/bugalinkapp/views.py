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
        
    def get_sporadic_individual_lifts(self,request):
        try:
            individual_lift = IndividualLift.objects.get(idIndividualLift = request.data['idIndividualLift']) 
            return individual_lift.lift.driver_routine.one_lift
        except Exception as e:
            raise e
