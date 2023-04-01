from django.contrib.postgres.fields import ArrayField
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
    # TODO: CASCADE or SET_NULL?
    origin = models.ForeignKey(
        Location, on_delete=models.SET_NULL, related_name="origin", null=True
    )
    destination = models.ForeignKey(
        Location, on_delete=models.SET_NULL, related_name="destination", null=True
    )

    days_of_week = ArrayField(
        models.CharField(
            choices=DAYS_OF_WEEK,
            max_length=7,
            verbose_name=_("Day of week"),
        )
    )
    driver_note = models.CharField(max_length=2048, null=True)

    def __str__(self):
        return f"{self.passenger_routine} - {self.days} - {self.departure_time_start} to {self.departure_time_end}"
