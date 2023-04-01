# from django.contrib.gis.db import models as gis_models
from django.db import models

# A location has the following fields:
# name: name of the location (string representation)
# coordinates: coordinates of the location (coordinates)

# Coordinates are unique, so a location can only be defined once and is reused by all routines that have the same location
# (Useful for the long-run, when we have a lot of routines and we don't want to store the same location multiple times,
# and for gathering usage analytics on the most popular locations to optimize recommendations)


class Location(models.Model):
    address = models.CharField(max_length=200)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return f"{self.address} - {self.coordinates}"
