from django.db import models

# Create your models here.

class newsletter(models.Model):
    email = models.CharField(max_length=100, unique=True)