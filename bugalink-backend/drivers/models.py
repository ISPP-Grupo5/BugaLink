from django.db import models

from users.models import User


class Driver(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="driver")
    # vehicles = models.OneToManyField(Vehicle, on_delete=models.CASCADE, related_name="driver")
    # preferences = models.OneToOneField(DriverPreference, on_delete=models.CASCADE, related_name="driver")
    # Sworn declaration, DNI, driver license, entry date as driver...

    def __str__(self):
        return f"{self.user.email} - {self.routines.count()} routines"
