import json

from django.test import TestCase
from ratings.models import DriverRating
from rest_framework.test import APIClient
from users.tests import load_complex_data


class TripSearchTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        load_complex_data(self)
        self.client.force_authenticate(user=self.user)
        DriverRating.objects.create(trip_request=self.trip_request_2, rating=1.0)

    def test_get_trip_by_search(self):
        url = "/api/v1/trips/search?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&days=Mon&min_stars=1.&"
        "min_price=0.&max_price=100.&date_from=2000-01-01&date_to=2030-01-01&hour_from=00:00&hour_to=23:59&prefers_music=False&"
        "prefers_talk=False&allows_pets=False&allows_smoking=False"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(data["trips"][0]["id"], self.trip_2.id)
