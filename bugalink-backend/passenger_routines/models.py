import datetime

from django.db import models
from django.utils.translation import gettext_lazy as _

from locations.models import Location
from passengers.models import Passenger
from utils import DAYS_OF_WEEK


class PassengerRoutine(models.Model):
    passenger = models.ForeignKey(
        Passenger, on_delete=models.CASCADE, related_name="routines", null=True
    )
    departure_time_start = models.TimeField(_("Departure time window begin"))
    departure_time_end = models.TimeField(_("Departure time window end"))
    arrival_time = models.TimeField()
    origin = models.ForeignKey(
        Location,
        on_delete=models.SET_NULL,
        related_name="origin_routines_passenger",
        null=True,
    )
    destination = models.ForeignKey(
        Location,
        on_delete=models.SET_NULL,
        related_name="destination_routines_passenger",
        null=True,
    )
    day_of_week = models.CharField(choices=DAYS_OF_WEEK, max_length=7, verbose_name=_("Day of week"))

    def __str__(self):
        return f"{self.origin} to {self.destination}"
