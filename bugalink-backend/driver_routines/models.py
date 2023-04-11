import datetime

from django.db import models
from django.utils.translation import gettext_lazy as _
from drivers.models import Driver
from locations.models import Location
from utils import DAYS_OF_WEEK


class DriverRoutine(models.Model):
    driver = models.ForeignKey(
        Driver, on_delete=models.CASCADE, related_name="routines", null=True
    )
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    note = models.CharField(max_length=2000, blank=True)
    is_recurrent = models.BooleanField(default=False)
    available_seats = models.IntegerField(default=1)
    departure_time_start = models.TimeField(_("Departure time window begin"))
    departure_time_end = models.TimeField(_("Departure time window end"))
    arrival_time = models.TimeField()
    origin = models.ForeignKey(
        Location, on_delete=models.SET_NULL, related_name="origin", null=True
    )
    destination = models.ForeignKey(
        Location, on_delete=models.SET_NULL, related_name="destination", null=True
    )

    day_of_week = models.CharField(
        choices=DAYS_OF_WEEK, max_length=7, verbose_name=_("Day of week")
    )

    def __str__(self):
        return f"{self.driver} - {self.day_of_week} - {self.departure_time_start} to {self.arrival_time}"
