from locations.models import Location
from django.test import TestCase
from rest_framework.test import APIClient
import json
from datetime import time, datetime, timedelta
from .models import User
from passengers.models import Passenger
from drivers.models import Driver
from driver_routines.models import DriverRoutine
from trips.models import Trip, TripRequest
from ratings.models import DriverRating

def load_data(self):
    self.user = User.objects.create(email="test@test.com", first_name="nameTest", last_name="lastNameTest", is_passenger = True, is_driver=True)
    self.passenger = Passenger.objects.create(user=self.user)
    self.driver = Driver.objects.create(user=self.user)

def load_complex_data(self):
    '''
    Crea:
    * self.driver_routine para self.driver
    * self.trip(FINISHED) y self.trip_2(PENDING) para self.driver_routine 
    * self.user_2 otro usuario con passenger_2 y driver_2
    * self.trip_request(ACCEPTED) para passenger_2 en self.trip
    * self.trip_request_2(PENDING) para passenger_2 en self.trip_2
    '''
    load_data(self)
    self.user_2 = User.objects.create(email="test2@test.com", first_name="Second User", last_name="lastNameTest2", is_passenger = True, is_driver=True)
    self.passenger_2 = Passenger.objects.create(user=self.user_2)
    self.driver_2 = Driver.objects.create(user=self.user_2)

    self.location_1 = Location.objects.create(
        address = "Mi casa",
        latitude = 45.1231231,
        longitude = 123.11118945
    )
    self.location_2 = Location.objects.create(
        address = "Trabajo",
        latitude = 41.1223121231,
        longitude = 14.467800675
    )
    self.driver_routine = DriverRoutine.objects.create(
        driver = self.driver,
        price = 1,
        is_recurrent=True,
        available_seats=1,
        departure_time_start = datetime.now().time(),
        departure_time_end = datetime.now().time(),
        arrival_time = datetime.now().time(),
        origin = self.location_1,
        destination = self.location_2,
        day_of_week = "Mon",
    )
    self.trip = Trip.objects.create(
        driver_routine = self.driver_routine,
        departure_datetime = datetime.now(),
        arrival_datetime = datetime.now(),
        status="FINISHED"
    )
    self.trip_2 = Trip.objects.create(
        driver_routine = self.driver_routine,
        departure_datetime = datetime.now(),
        arrival_datetime = datetime.now(),
        status="PENDING"
    )
    self.trip_request = TripRequest.objects.create(
        trip = self.trip,
        status = "ACCEPTED",
        passenger = self.passenger_2,
        price=1.2
    )
    self.trip_request_2 = TripRequest.objects.create(
        trip = self.trip_2,
        status = "PENDING",
        passenger = self.passenger_2,
        price=1.2
    )


class UserUpdateViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        load_data(self)
        self.client.force_authenticate(user=self.user)

    def test_put_edit_profile(self):
        url = "/api/v1/users/"+ str(self.user.pk) + "/edit/"
        new_first_name = "New first name"
        new_last_name = "New lastName"
        body={
            "first_name": new_first_name,
            "last_name": new_last_name,
            }
        self.client.put(url, data=body)
        self.assertEqual(self.user.first_name, new_first_name)
        self.assertEqual(self.user.last_name, new_last_name)

class UserStatsViewTest(TestCase):
    def setUp(self):
        load_complex_data(self)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.driver_rating = DriverRating.objects.create(
            trip_request = self.trip_request,
            rating = 4,
        )
        
    def test_get_user_stats_driver(self):
        url = f"/api/v1/users/{self.user.pk}/stats/"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(data['total_rides'], 1) # 1 Trip finalizado en el que ha participado

    def test_get_user_stats_passenger(self):
        url = f"/api/v1/users/{self.user_2.pk}/stats/"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(data['total_rides'], 1) # 1 Trip finalizado en el que ha participado

    def test_get_driver_rating(self):
        url = f"/api/v1/users/{self.user.pk}/stats/"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(data['number_ratings'], 1) 
        self.assertEqual(data['rating'], 4)

    def test_get_null_rating(self):
        url = f"/api/v1/users/{self.user_2.pk}/stats/"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(data['number_ratings'], 0) 
        self.assertEqual(data['rating'], 0)

class UserRatingViewTest(TestCase):
    def setUp(self):
        load_complex_data(self)
        self.driver_rating = DriverRating.objects.create(
            trip_request = self.trip_request,
            rating = 4,
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_get_driver_rating(self):
        url = f"/api/v1/users/{self.user.pk}/rating/"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(data['number_ratings'], 1) 
        self.assertEqual(data['rating'], 4)

    def test_get_null_rating(self):
        url = f"/api/v1/users/{self.user_2.pk}/rating/"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(data['number_ratings'], 0) 
        self.assertEqual(data['rating'], 0)