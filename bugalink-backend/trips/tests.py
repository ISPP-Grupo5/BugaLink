import datetime
import json

from django.test import TestCase
from passenger_routines.models import PassengerRoutine
from rest_framework.test import APIClient
from trips.models import Trip
from users.tests import load_complex_data


class TripSearchTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        load_complex_data(self)
        self.client.force_authenticate(user=self.user)

    def test_get_trip_by_search(self):
        url = "/api/v1/trips/45.1231231,123.11118945/41.1223121231,14.467800675/Mon/0./0./100./2000-01-01/2030-01-01/00:00/23:59/False/False/False/False/search"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(data["trips"][0]["id"], self.trip_2.id)
