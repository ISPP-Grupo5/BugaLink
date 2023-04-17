from .models import DriverRating, Report
from rest_framework import serializers

class DriverRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverRating
        fields = ('__all__')


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ('__all__')