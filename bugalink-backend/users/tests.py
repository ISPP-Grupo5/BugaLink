from django.test import TestCase
from rest_framework.test import APIClient
import json
from datetime import time, datetime, timedelta
from .models import User
from passengers.models import Passenger
from drivers.models import Driver
from driver_routines.models import DriverRoutine
from trips.models import Trip, TripRequest


# Función para instanciar datos en los tests. se debe usar en el setUp de la clase y pasar self como parámetro
def load_data(self):
    self.user = User.objects.create(email="test@test.com", first_name="nameTest", last_name="lastNameTest", is_passenger = True, is_driver=True)
    self.passenger = Passenger.objects.create(user=self.user)
    self.driver = Driver.objects.create(user=self.user, preference_0 = False, preference_1 = False, preference_2 = False, preference_3 = False, )
    
    self.user2 = User.objects.create(email="test2@test.com", first_name="nameTest", last_name="lastNameTest", is_passenger = True, is_driver=True)
    self.passenger2 = Passenger.objects.create(user=self.user2)
    self.driver2 = Driver.objects.create(user=self.user2, preference_0 = False, preference_1 = False, preference_2 = False, preference_3 = False, )
    
    self.driver_routine = DriverRoutine.objects.create(driver=self.driver1,
                                                       departure_time_start = time(10 , 0 , 0),
                                                       departure_time_end = time(11 , 0 , 0),
                                                       arrival_time = time(11, 0 , 0),
                                                       day_of_week = "Mon")
    self.trip = Trip.objects.create(driver_routine=self.driver_routine,
                                    departure_datetime = datetime.now() + timedelta(hours=1))
    self.trip_request = TripRequest.objects.create(trip=self.trip,
                                                   passenger=self.passenger2)

class PreferencesTest(TestCase):
    def setUp(self):
        load_data(self);
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_get_preferences(self):
        
        url = "/api/v1/users/"+ str(self.user.pk) + "/preferences/"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(data['preference_0'],self.driver.preference_0)
        self.assertEqual(data['preference_1'],self.driver.preference_1)
        self.assertEqual(data['preference_2'],self.driver.preference_2)
        self.assertEqual(data['preference_3'],self.driver.preference_3)

    def test_put_preferences(self):
        url = "/api/v1/users/"+ str(self.user.pk) + "/preferences/"
        body={
            "preference_0": True,
            "preference_1": False,
            "preference_2": False,
            "preference_3": True
            }
        response = self.client.put(url, data=body)
        data = json.loads(response.content)
        self.assertEqual(data['preference_0'],body['preference_0'])
        self.assertEqual(data['preference_1'],body['preference_1'])
        self.assertEqual(data['preference_2'],body['preference_2'])
        self.assertEqual(data['preference_3'],body['preference_3'])

    def test_invalid_put(self):
        url = "/api/v1/users/"+ str(self.user2.pk) + "/preferences/"
        body={
            "preference_0": True,
            "preference_1": False,
            "preference_2": False,
            "preference_3": True
            }
        response = self.client.put(url, data=body)
        data = json.loads(response.content)
        self.assertEqual(response.status_code, 403)
        self.assertIsNotNone(data.get('error'))



# users/<int:user_id>/trip-requests/
# users/<int:user_id>/trip-requests/count/
class TripRequestsTest(TestCase):
    def setUp(self):
        load_data(self);
        self.client = APIClient();
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