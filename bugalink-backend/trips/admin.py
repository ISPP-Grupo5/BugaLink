from django.contrib import admin

from .models import Trip, TripRequest

admin.site.register(TripRequest)
admin.site.register(Trip)
