import datetime
import json

from django.test import TestCase
from passenger_routines.models import PassengerRoutine
from ratings.models import DriverRating, Report
from rest_framework.test import APIClient
from trips.models import Trip, TripRequest
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
            passenger=self.passenger_2,
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
        self.client.force_authenticate(user=self.user_2)

    def test_get_trip_recommendation(self):
        url = "/api/v1/trips/recommendations/"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(data[0]["driver_routine"]["origin"]["address"], "Mi casa")


class TripSearchTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        load_complex_data(self)
        self.client.force_authenticate(user=self.user)
        DriverRating.objects.create(trip_request=self.trip_request_2, rating=1.0)

    def test_get_trip_by_search(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&days=Mon&min_stars=1.&"
        "min_price=0.&max_price=100.&date_from=2000-01-01&date_to=2030-01-01&hour_from=00:00&hour_to=23:59&prefers_music=False&"
        "prefers_talk=False&allows_pets=False&allows_smoking=False"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(data[0]["id"], self.trip_2.id)


class TripRateTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        load_complex_data(self)
        self.client.force_authenticate(user=self.user_2)

    def test_rate_trip(self):
        url = "/api/v1/trips/" + str(self.trip.pk) + "/rate/"

        self.client.post(
            url,
            data={
                "rating": 2.3,
                "is_good_driver": True,
                "is_pleasant_driver": False,
                "already_knew": True,
            },
        )

        self.assertEqual(
            DriverRating.objects.get(trip_request=self.trip_request).rating, 2.3
        )


class ReportTripUserTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        load_complex_data(self)
        self.client.force_authenticate(user=self.user)

    def test_report_trip_user(self):
        url = "/api/v1/trips/" + str(self.trip.id) + "/report-issue/"
        self.client.post(
            url,
            data={
                "reported_user_id": self.user_2.id,
                "reporter_is_driver": True,
                "reported_is_driver": False,
                "note": "note",
            },
        )
        self.assertEqual(Report.objects.get(id=1).note, "note")
