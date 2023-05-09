from django.contrib.postgres.fields import ArrayField
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from trips.models import Trip, TripRequest
from users.models import User


class DriverRating(models.Model):
    trip_request = models.OneToOneField(
        TripRequest, on_delete=models.CASCADE, related_name="driver_rating"
    )  # Validar que sólo se pueda hacer una vez por viaje
    rating = models.FloatField(
        validators=[MinValueValidator(1.0), MaxValueValidator(5.0)]
    )
    is_good_driver = models.BooleanField(default=False)
    is_pleasant_driver = models.BooleanField(default=False)
    already_knew = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.trip_request.trip.driver_routine.driver.user} - {self.rating}"


class Report(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="report_trip")
    reporter_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="reporter_user"
    )
    reported_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="reported_user"
    )

    # NOTE: these fields should be dynamic, we could define getters for them
    # This leads to inconsistences in the data and lead to bugs if we don't
    # set them right on the views/factory
    reporter_is_driver = models.BooleanField(default=False)
    reported_is_driver = models.BooleanField(default=False)
    note = models.CharField(max_length=2048)

    def __str__(self):
        return f"{self.reported_user} REPORTED BY {self.reporter_user}"
