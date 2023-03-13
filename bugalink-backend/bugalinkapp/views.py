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

from rest_framework import viewsets
from rest_framework.decorators import action

from .serializers import DriverRatingSerializer, PassengerRatingSerializer
from .models import DriverRating, PassengerRating


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

class RatingViewSet(viewsets.ModelViewSet):
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
