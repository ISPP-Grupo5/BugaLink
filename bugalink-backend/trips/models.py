from django.db import models
from driver_routines.models import DriverRoutine
from passengers.models import Passenger


class Trip(models.Model):
    driver_routine = models.ForeignKey(
        DriverRoutine, on_delete=models.CASCADE, related_name="trips"
    )
    departure_datetime = models.DateTimeField()
    arrival_datetime = models.DateTimeField()
    status = models.CharField(
        choices=(
            ("PENDING", "PENDING"),
            ("FINISHED", "FINISHED"),
        ),
        default="PENDING",
        max_length=10,
    )

    def __str__(self):
        return f"{self.pk} - {self.driver_routine} on {self.departure_datetime}"

    def get_avaliable_seats(self):
        return self.driver_routine.available_seats - len(
            TripRequest.objects.filter(trip=self, status="ACCEPTED")
        )


# Model TripRequest has the following fields:
# * trip: The trip that the passenger wants to join to
# * is_recurrent: If the passenger wants to request a single ride or to be a recurrent passenger for the routine
# * status: Can have the values "Pending" when the driver hasn't decided, "Accepted", "Rejected" or "Finished" when the ride has happened in the past
# * note: An optional text note the passenger can write to the driver to inform of something
class TripRequest(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="requests")
    status = models.CharField(
        choices=(
            ("PENDING", "PENDING"),
            ("ACCEPTED", "ACCEPTED"),
            ("REJECTED", "REJECTED"),
        ),
        default="PENDING",
        max_length=10,
    )
    note = models.CharField(max_length=2000, null=True)
    reject_note = models.CharField(max_length=2048, null=True)
    passenger = models.ForeignKey(
        Passenger, on_delete=models.CASCADE, related_name="passenger"
    )
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.pk} - {self.passenger} requests to join {self.trip} on {self.trip.departure_datetime}"
