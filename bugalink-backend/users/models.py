from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models


class User(AbstractBaseUser):
    username = None  # We don't use username in the app, the unique ID is email
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=150)
    # birth_date = models.DateField(null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    verified = models.BooleanField(default=False)
    photo = models.ImageField(upload_to="users/profile_pictures/", blank=True)
    is_passenger = models.BooleanField(default=True)
    is_driver = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    # REQUIRED_FIELDS = []

    objects = BaseUserManager()

    def __str__(self):
        return self.email


class AdminUser(User):
    class Meta:
        proxy = True

    def save(self, *args, **kwargs):
        self.is_superuser = True
        self.is_staff = True
        super().save(*args, **kwargs)
