from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.core import serializers
from rest_framework.views import APIView
from bugalinkapp.models import *
from django.http import HttpResponse
from django.http import Http404
from django.contrib.auth.models import User
from .serializers import *


from rest_framework import serializers


class users(APIView):
    def get(self, request): 
        try:
            user =  User.objects.get(id = request.data['id'])
            serializer = UserSerializer(user, context = {'request':request})
            return Response(serializer.data)
        except User.DoesNotExist:
            raise Http404
        
class pendingIndividualRide(APIView):
    def get(self,request):
        try:
            user =  User.objects.get(id = request.data['id'])
            passenger = Passenger.objects.get(user = user)
            rides =  IndividualRide.objects.filter(passenger = passenger, acceptation_status = 'Pending Confirmation')
            serializer = ListaIndividualRideSerializer({'rides': rides})
            return Response(serializer.data)            
        except IndividualRide.DoesNotExist:
            raise Http404

class cancelledIndividualRide(APIView):
    def get(self,request):
        try:
            user =  User.objects.get(id = request.data['id'])
            passenger = Passenger.objects.get(user = user)
            rides =  IndividualRide.objects.filter(passenger = passenger, acceptation_status = 'Cancelled')
            serializer = ListaIndividualRideSerializer(rides, many=True)
            return Response(serializer.data)            
        except IndividualRide.DoesNotExist:
            raise Http404
        
class acceptedIndividualRide(APIView):
    def get(self,request):
        try:
            user =  User.objects.get(id = request.data['id'])
            passenger = Passenger.objects.get(user = user)
            rides =  IndividualRide.objects.filter(passenger = passenger, acceptation_status = 'Accepted')
            serializer = ListaIndividualRideSerializer(rides, many=True)
            return Response(serializer.data)            
        except IndividualRide.DoesNotExist:
            raise Http404
        