from django.test import TestCase
from rest_framework.test import APIClient
import json
from datetime import time, datetime, timedelta
from .models import User
from passengers.models import Passenger
from drivers.models import Driver
from driver_routines.models import DriverRoutine
from trips.models import Trip, TripRequest



class UserUpdateViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(email="test@test.com", first_name="nameTest", last_name="lastNameTest", is_passenger = True, is_driver=True)
        self.passenger = Passenger.objects.create(user=self.user)
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