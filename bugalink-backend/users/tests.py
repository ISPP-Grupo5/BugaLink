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
    self.passenger1 = Passenger.objects.create(user=self.user1)
    self.driver1 = Driver.objects.create(user=self.user1)
    
    #Pasajero
    self.user2 = User.objects.create(email="test2@test.es", first_name="test", last_name="test", date_joined=datetime.now())
    self.passenger2 = Passenger.objects.create(user=self.user2)
    
    self.driver_routine = DriverRoutine.objects.create(driver=self.driver1,
                                                       departure_time_start = time(10 , 0 , 0),
                                                       departure_time_end = time(11 , 0 , 0),
                                                       arrival_time = time(11, 0 , 0),
                                                       day_of_week = "Mon")
    self.trip = Trip.objects.create(driver_routine=self.driver_routine,
                                    departure_datetime = datetime.now() + timedelta(hours=1))
    self.trip_request = TripRequest.objects.create(trip=self.trip,
                                                   passenger=self.passenger2)

# users/<int:user_id>/trip-requests/
# users/<int:user_id>/trip-requests/count/
class TripRequestsTest(TestCase):
    def setUp(self):
        self.client = APIClient();
        load_data(self);
        self.client.force_authenticate(user=self.user1)

    def test_get_trip_request_count(self):
        url = "/api/v1/users/" + str(self.user1.pk) + "/trip-requests/count/"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['numTrips'], 1)

class UpcomingTrips(TestCase):
    def setUp(self):
        self.client = APIClient();
        load_data(self);
        self.client.force_authenticate(user=self.user1)
        
    def test_get_upcoming_trips(self):
        url = "/api/v1/users/" + str(self.user1.pk) + "/trip/upcoming/"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        #self.assertEqual(data['numTrips'], 1)