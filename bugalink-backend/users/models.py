from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    def create_superuser(self, email, password):
        return self._create_user(email, password)

    def _create_user(self, email, password):
        email = self.normalize_email(email)
        user = AdminUser(email=email)
        user.set_password(password)
        user.save()
        return user


class User(AbstractBaseUser):
    username = None  # We don't use username in the app, the unique ID is email
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=150)
    date_joined = models.DateTimeField(auto_now_add=True)
    verified = models.BooleanField(default=False)
    photo = models.ImageField(upload_to="users/profile_pictures/", blank=True)
    is_passenger = models.BooleanField(default=True)
    is_driver = models.BooleanField(default=False)
    is_validated_driver = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    USERNAME_FIELD = "email"

    objects = UserManager()

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser

    def __str__(self):
        return self.email


class AdminUser(User):
    class Meta:
        proxy = True

    def save(self, *args, **kwargs):
        self.is_superuser = True
        self.is_staff = True
        super().save(*args, **kwargs)
