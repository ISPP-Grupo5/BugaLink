from .models import DriverRating
from rest_framework import serializers

class DriverRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverRating
        fields = ('__all__')