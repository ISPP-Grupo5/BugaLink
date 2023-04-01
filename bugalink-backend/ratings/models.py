from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from trips.models import Trip
from users.models import User
from django.contrib.postgres.fields import ArrayField


class DriverRating(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE,
                             related_name='rating_trip')  # Validar que sólo se pueda hacer una vez por viaje
    rating = models.FloatField(validators=[MinValueValidator(1.0), MaxValueValidator(5.0)])
    preferences = ArrayField(models.BooleanField(default=False), size=4)

    def __str__(self):
        return f'{self.trip} - {self.rating} - {self.preferences}'


class Report(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='report_trip')
    reporter_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reporter_user')
    reported_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reported_user')
    reporter_is_driver = models.BooleanField(default=False)
    reported_is_driver = models.BooleanField(default=False)
    note = models.CharField(max_length=2048)
