from django.contrib.postgres.fields import ArrayField
from django.db import models
from users.models import User

document_validation_choices = (
    ("Waiting validation", "Waiting validation"),
    ("Validated", "Validated"),
    ("Cancelled", "Cancelled"),
)


class Driver(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="driver")
    preference_0 = models.BooleanField(default=False)
    preference_1 = models.BooleanField(default=False)
    preference_2 = models.BooleanField(default=False)
    preference_3 = models.BooleanField(default=False)
    dni_status = models.CharField(
        choices=document_validation_choices, default="Waiting validation", max_length=20
    )
    sworn_declaration_status = models.CharField(
        choices=document_validation_choices, default="Waiting validation", max_length=20
    )
    driver_license_status = models.CharField(
        choices=document_validation_choices, default="Waiting validation", max_length=20
    )
    dni = models.ImageField(upload_to="drivers/dnis/", null=True, blank=True)
    sworn_declaration = models.ImageField(
        upload_to="drivers/sworn_declarations/", null=True, blank=True
    )
    driver_license = models.ImageField(
        upload_to="drivers/driver_licenses/", null=True, blank=True
    )

    def __str__(self):
        return f"{self.user.email} - {self.routines.count()} routines"
