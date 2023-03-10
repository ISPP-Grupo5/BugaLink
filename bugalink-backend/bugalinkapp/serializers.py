from rest_framework import serializers
from bugalinkapp.models import User, DriverRating, PassengerRating

class main_page_serializer(serializers.ModelSerializer):

    class Meta:
    
        model = User
        fields = ['idUser']

class DriverRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverRating
        fields = '__all__'

class PassengerRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PassengerRating
        fields = '__all__'