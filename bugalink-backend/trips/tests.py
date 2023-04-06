import datetime
import json

from django.test import TestCase
from passenger_routines.models import PassengerRoutine
from rest_framework.test import APIClient
from trips.models import Trip
from users.tests import load_complex_data


class GetTripRecommendationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        load_complex_data(self)

        self.trip_3 = Trip.objects.create(
            driver_routine=self.driver_routine,
            departure_datetime=datetime.datetime.now() + datetime.timedelta(days=1),
            arrival_datetime=datetime.datetime.now()
            + datetime.timedelta(days=1, hours=1),
            status="PENDING",
        )

        self.passenger_routine_1 = PassengerRoutine.objects.create(
            passenger=self.passenger,
            departure_time_start=(
                datetime.datetime.now() - datetime.timedelta(hours=1)
            ).time(),
            departure_time_end=(
                datetime.datetime.now() + datetime.timedelta(hours=1)
            ).time(),
            arrival_time=(datetime.datetime.now() + datetime.timedelta(hours=1)).time(),
            origin=self.location_1,
            destination=self.location_2,
            day_of_week="Mon",
        )
        self.client.force_authenticate(user=self.user)

    def test_get_trip_recommendation(self):
        url = "/api/v1/trips/" + str(self.user.pk) + "/recommendations"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(
            data["trips"][0]["driver_routine"]["origin"]["address"], "Mi casa"
        )
