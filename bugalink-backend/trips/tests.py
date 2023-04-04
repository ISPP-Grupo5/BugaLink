from datetime import time, datetime, timedelta
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.core.files.uploadedfile import SimpleUploadedFile
import json

from users.models import User
from passengers.models import Passenger
from drivers.models import Driver
from driver_routines.models import DriverRoutine
from trips.models import Trip, TripRequest


# Función para instanciar datos en los tests. se debe usar en el setUp de la clase y pasar self como parámetro
def load_data(self):
    #Conductor
    self.user1 = User.objects.create(email="test1@test.es", first_name="test", last_name="test", date_joined=datetime.now())
    self.user1.save();
    self.passenger1 = Passenger.objects.create(user=self.user1)
    self.passenger1.save();
    self.driver1 = Driver.objects.create(user=self.user1)
    self.driver1.save();
    
    #Pasajero
    self.user2 = User.objects.create(email="test2@test.es", first_name="test", last_name="test", date_joined=datetime.now())
    self.user2.save();
    self.passenger2 = Passenger.objects.create(user=self.user2)
    self.passenger2.save();
    
    self.driver_routine = DriverRoutine.objects.create(driver=self.driver1,
                                                       departure_time_start = time(10 , 0 , 0),
                                                       departure_time_end = time(11 , 0 , 0),
                                                       arrival_time = time(11, 0 , 0),
                                                       day_of_week = "Mon")
    self.driver_routine.save();
    self.trip = Trip.objects.create(driver_routine=self.driver_routine,
                                    departure_datetime = datetime.now() + timedelta(hours=1))
    self.trip.save();
    self.trip_request1 = TripRequest.objects.create(trip=self.trip,
                                                   passenger=self.passenger2)
    self.trip_request1.save();
    self.trip_request2 = TripRequest.objects.create(trip=self.trip,
                                                   passenger=self.passenger2)
    self.trip_request2.save();

# trip-requests/<int:pk>/reject/
# trip-requests/<int:pk>/accept/
class AcceptRejectTripRequestsTest(TestCase):
    def setUp(self):
        self.client = APIClient();
        load_data(self);
        self.client.force_authenticate(user=self.user1)

    def test_reject_trip_request(self):
        url = "/api/v1/trip-requests/" + str(self.trip_request1.pk) + "/reject/"
        response = self.client.put(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(TripRequest.objects.get(self.trip_request1.pk).status, "REJECTED")

    def test_accept_trip_request(self):
        url = "/api/v1/trip-requests/" + str(self.trip_request2.pk) + "/accept/"
        response = self.client.put(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(TripRequest.objects.get(self.trip_request2.pk).status, "ACCEPTED")