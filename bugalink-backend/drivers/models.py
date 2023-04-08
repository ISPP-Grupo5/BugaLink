from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.core.files.storage import FileSystemStorage
from django.db import models
from users.models import User


def user_directory_path(instance, filename):
    return "users/{0}/{1}".format(instance.user.id, filename)


document_validation_choices = (
    ("Waiting upload", "Waiting upload"),
    ("Waiting validation", "Waiting validation"),
    ("Validated", "Validated"),
    ("Cancelled", "Cancelled"),
)


class OverwriteStorage(FileSystemStorage):
    def get_available_name(self, name, max_length=None):
        if self.exists(name):
            self.delete(name)
        return name


class Driver(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="driver")
    prefers_talk = models.BooleanField(default=False)
    prefers_music = models.BooleanField(default=False)
    allows_pets = models.BooleanField(default=False)
    allows_smoke = models.BooleanField(default=False)
    dni_status = models.CharField(
        choices=document_validation_choices, default="Waiting upload", max_length=20
    )
    sworn_declaration_status = models.CharField(
        choices=document_validation_choices, default="Waiting upload", max_length=20
    )
    driver_license_status = models.CharField(
        choices=document_validation_choices, default="Waiting upload", max_length=20
    )
    dni_front = models.ImageField(
        upload_to=user_directory_path, storage=OverwriteStorage(), null=True, blank=True
    )
    dni_back = models.ImageField(
        upload_to=user_directory_path, storage=OverwriteStorage(), null=True, blank=True
    )
    sworn_declaration = models.ImageField(
        upload_to=user_directory_path, storage=OverwriteStorage(), null=True, blank=True
    )
    driver_license = models.ImageField(
        upload_to=user_directory_path, storage=OverwriteStorage(), null=True, blank=True
    )

    def __str__(self):
        return f"{self.user.email} - {self.routines.count()} routines"
