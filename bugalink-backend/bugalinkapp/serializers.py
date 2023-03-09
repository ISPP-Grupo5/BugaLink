from rest_framework import serializers
from bugalinkapp.models import *

class main_page_serializer(serializers.ModelSerializer):

    class Meta:
    
        model = User
        fields = ['idUser']

class individual_lift_acceptance_serializer(serializers.ModelSerializer):

    class Meta:
    
        model = IndividualLift
        fields = ['id_individual_lift', 'dni_driver', 'acceptation_status']
