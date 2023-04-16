import datetime
import json

from django.test import TestCase
from driver_routines.models import DriverRoutine
from drivers.models import Driver
from locations.models import Location
from passenger_routines.models import PassengerRoutine
from passengers.models import Passenger
from payment_methods.models import Balance
from ratings.models import DriverRating
from rest_framework.test import APIClient
from trips.models import Trip, TripRequest
from users.models import User
from users.tests import load_complex_data


class GetTripRecommendationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        load_complex_data(self)

        # Viaje de test unitario original
        self.trip_3 = Trip.objects.create(
            driver_routine=self.driver_routine,
            departure_datetime=datetime.datetime.now() + datetime.timedelta(days=1),
            arrival_datetime=datetime.datetime.now()
            + datetime.timedelta(days=1, hours=1),
            status="PENDING",
        )

        # Viaje similar asociado a una misma rutina, para devolucion de varios viajes
        self.trip_4 = Trip.objects.create(
            driver_routine=self.driver_routine,
            departure_datetime=datetime.datetime.now() + datetime.timedelta(days=1),
            arrival_datetime=datetime.datetime.now()
            + datetime.timedelta(days=1, hours=1),
            status="PENDING",
        )

        # Rutina con datos similares a la del driver
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

        ###### Caso rutina con coordenadas cercanas pero no iguales

        # Pasajero
        self.user_3 = User.objects.create(
            email="test3@test.com",
            first_name="Third User",
            last_name="lastNameTest3",
            is_passenger=True,
            is_driver=False,
        )
        self.passenger_3 = Passenger.objects.create(user=self.user_3)

        # Conductor
        self.user_4 = User.objects.create(
            email="test4@test.com",
            first_name="Fourth User",
            last_name="lastNameTest4",
            is_passenger=True,
            is_driver=True,
        )
        self.passenger_4 = Passenger.objects.create(user=self.user_4)
        self.driver_4 = Driver.objects.create(user=self.user_4)

        # Origen driver
        self.location_origin_4 = Location.objects.create(
            address="Mi casa", latitude=200.1231231, longitude=200.11118945
        )

        # Destino driver
        self.location_destination_4 = Location.objects.create(
            address="Mi casa", latitude=200.1231231, longitude=200.11118945
        )

        # Driver routine
        self.driver_routine_4 = DriverRoutine.objects.create(
            driver=self.driver_4,
            price=1,
            is_recurrent=True,
            available_seats=1,
            departure_time_start=datetime.datetime.now().time(),
            departure_time_end=datetime.datetime.now().time(),
            arrival_time=datetime.datetime.now().time(),
            origin=self.location_origin_4,
            destination=self.location_destination_4,
            day_of_week="Mon",
        )

        # Trip
        self.trip_5 = Trip.objects.create(
            driver_routine=self.driver_routine_4,
            departure_datetime=datetime.datetime.now() + datetime.timedelta(days=1),
            arrival_datetime=datetime.datetime.now()
            + datetime.timedelta(days=1, hours=1),
            status="PENDING",
        )

        # Origen pasajero
        self.location_close_origin_3 = Location.objects.create(
            address="Al lado de mi casa", latitude=200.1241231, longitude=200.11118945
        )

        # Destino pasajero
        self.location_close_destination_3 = Location.objects.create(
            address="Al lado de mi casa", latitude=200.1241231, longitude=200.11118945
        )

        # Passenger Routine
        self.passenger_routine_3 = PassengerRoutine.objects.create(
            passenger=self.passenger_3,
            departure_time_start=(
                datetime.datetime.now() - datetime.timedelta(hours=1)
            ).time(),
            departure_time_end=(
                datetime.datetime.now() + datetime.timedelta(hours=1)
            ).time(),
            arrival_time=(datetime.datetime.now() + datetime.timedelta(hours=1)).time(),
            origin=self.location_close_origin_3,
            destination=self.location_close_destination_3,
            day_of_week="Mon",
        )

        ###### Caso rutina con coordenadas lejanas en el origen

        # Pasajero
        self.user_5 = User.objects.create(
            email="test5@test.com",
            first_name="Fifth User",
            last_name="lastNameTest5",
            is_passenger=True,
            is_driver=False,
        )
        self.passenger_5 = Passenger.objects.create(user=self.user_5)

        # Conductor
        self.user_6 = User.objects.create(
            email="test6@test.com",
            first_name="SixthUser",
            last_name="lastNameTest6",
            is_passenger=True,
            is_driver=True,
        )
        self.passenger_6 = Passenger.objects.create(user=self.user_6)
        self.driver_6 = Driver.objects.create(user=self.user_6)

        # Origen driver
        self.location_origin_6 = Location.objects.create(
            address="Mi casa", latitude=46.1231231, longitude=124.11118945
        )

        # Destino driver
        self.location_destination_6 = Location.objects.create(
            address="Mi casa", latitude=46.1231231, longitude=124.11118945
        )

        # Driver routine
        self.driver_routine_6 = DriverRoutine.objects.create(
            driver=self.driver_6,
            price=1,
            is_recurrent=True,
            available_seats=1,
            departure_time_start=datetime.datetime.now().time(),
            departure_time_end=datetime.datetime.now().time(),
            arrival_time=datetime.datetime.now().time(),
            origin=self.location_origin_6,
            destination=self.location_destination_6,
            day_of_week="Mon",
        )

        # Trip
        self.trip_6 = Trip.objects.create(
            driver_routine=self.driver_routine_6,
            departure_datetime=datetime.datetime.now() + datetime.timedelta(days=1),
            arrival_datetime=datetime.datetime.now()
            + datetime.timedelta(days=1, hours=1),
            status="PENDING",
        )

        # Origen pasajero
        self.location_far_origin_5 = Location.objects.create(
            address="Lejos de casa", latitude=47.1241231, longitude=124.11118945
        )

        # Destino pasajero
        self.location_far_destination_5 = Location.objects.create(
            address="Lejos de casa", latitude=47.1241231, longitude=124.11118945
        )

        # Passenger Routine
        self.passenger_routine_5 = PassengerRoutine.objects.create(
            passenger=self.passenger_5,
            departure_time_start=(
                datetime.datetime.now() - datetime.timedelta(hours=1)
            ).time(),
            departure_time_end=(
                datetime.datetime.now() + datetime.timedelta(hours=1)
            ).time(),
            arrival_time=(datetime.datetime.now() + datetime.timedelta(hours=1)).time(),
            origin=self.location_far_origin_5,
            destination=self.location_far_destination_5,
            day_of_week="Mon",
        )

        ###### Caso rutina similar pero diferente dia (day of week)

        # Pasajero
        self.user_7 = User.objects.create(
            email="test7@test.com",
            first_name="Seventh User",
            last_name="lastNameTest7",
            is_passenger=True,
            is_driver=False,
        )
        self.passenger_7 = Passenger.objects.create(user=self.user_7)

        # Conductor
        self.user_8 = User.objects.create(
            email="test8@test.com",
            first_name="Eighth User",
            last_name="lastNameTest8",
            is_passenger=True,
            is_driver=True,
        )
        self.passenger_8 = Passenger.objects.create(user=self.user_8)
        self.driver_8 = Driver.objects.create(user=self.user_8)

        # Origen driver
        self.location_origin_8 = Location.objects.create(
            address="Mi casa", latitude=200.1231231, longitude=200.11118945
        )

        # Destino driver
        self.location_destination_8 = Location.objects.create(
            address="Mi casa", latitude=200.1231231, longitude=200.11118945
        )

        # Driver routine
        self.driver_routine_8 = DriverRoutine.objects.create(
            driver=self.driver_8,
            price=1,
            is_recurrent=True,
            available_seats=1,
            departure_time_start=datetime.datetime.now().time(),
            departure_time_end=datetime.datetime.now().time(),
            arrival_time=datetime.datetime.now().time(),
            origin=self.location_origin_8,
            destination=self.location_destination_8,
            day_of_week="Mon",
        )

        # Trip
        self.trip_8 = Trip.objects.create(
            driver_routine=self.driver_routine_8,
            departure_datetime=datetime.datetime.now() + datetime.timedelta(days=1),
            arrival_datetime=datetime.datetime.now()
            + datetime.timedelta(days=1, hours=1),
            status="PENDING",
        )

        # Origen pasajero
        self.location_close_origin_7 = Location.objects.create(
            address="Al lado de mi casa", latitude=200.1241231, longitude=200.11118945
        )

        # Destino pasajero
        self.location_close_destination_7 = Location.objects.create(
            address="Al lado de mi casa", latitude=200.1241231, longitude=200.11118945
        )

        # Passenger Routine
        self.passenger_routine_7 = PassengerRoutine.objects.create(
            passenger=self.passenger_7,
            departure_time_start=(
                datetime.datetime.now() - datetime.timedelta(hours=1)
            ).time(),
            departure_time_end=(
                datetime.datetime.now() + datetime.timedelta(hours=1)
            ).time(),
            arrival_time=(datetime.datetime.now() + datetime.timedelta(hours=1)).time(),
            origin=self.location_close_origin_7,
            destination=self.location_close_destination_7,
            day_of_week="Tue",
        )

        ###### Caso rutina similar pero status incorrecto

        # Pasajero
        self.user_9 = User.objects.create(
            email="test9@test.com",
            first_name="Nineth User",
            last_name="lastNameTest9",
            is_passenger=True,
            is_driver=False,
        )
        self.passenger_9 = Passenger.objects.create(user=self.user_9)

        # Conductor
        self.user_10 = User.objects.create(
            email="test10@test.com",
            first_name="Tenth User",
            last_name="lastNameTest10",
            is_passenger=True,
            is_driver=True,
        )
        self.passenger_10 = Passenger.objects.create(user=self.user_10)
        self.driver_10 = Driver.objects.create(user=self.user_10)

        # Origen driver
        self.location_origin_10 = Location.objects.create(
            address="Mi casa", latitude=200.1231231, longitude=200.11118945
        )

        # Destino driver
        self.location_destination_10 = Location.objects.create(
            address="Mi casa", latitude=200.1231231, longitude=200.11118945
        )

        # Driver routine
        self.driver_routine_10 = DriverRoutine.objects.create(
            driver=self.driver_10,
            price=1,
            is_recurrent=True,
            available_seats=1,
            departure_time_start=datetime.datetime.now().time(),
            departure_time_end=datetime.datetime.now().time(),
            arrival_time=datetime.datetime.now().time(),
            origin=self.location_origin_8,
            destination=self.location_destination_8,
            day_of_week="Tue",
        )

        # Trip
        self.trip_10 = Trip.objects.create(
            driver_routine=self.driver_routine_8,
            departure_datetime=datetime.datetime.now() + datetime.timedelta(days=1),
            arrival_datetime=datetime.datetime.now()
            + datetime.timedelta(days=1, hours=1),
            status="FINISHED",
        )

        # Origen pasajero
        self.location_close_origin_9 = Location.objects.create(
            address="Al lado de mi casa", latitude=200.1241231, longitude=200.11118945
        )

        # Destino pasajero
        self.location_close_destination_9 = Location.objects.create(
            address="Al lado de mi casa", latitude=200.1241231, longitude=200.11118945
        )

        # Passenger Routine
        self.passenger_routine_9 = PassengerRoutine.objects.create(
            passenger=self.passenger_9,
            departure_time_start=(
                datetime.datetime.now() - datetime.timedelta(hours=1)
            ).time(),
            departure_time_end=(
                datetime.datetime.now() + datetime.timedelta(hours=1)
            ).time(),
            arrival_time=(datetime.datetime.now() + datetime.timedelta(hours=1)).time(),
            origin=self.location_close_origin_7,
            destination=self.location_close_destination_7,
            day_of_week="Tue",
        )

        ###### Caso rutina similar pero fecha incorrecta

        # Pasajero
        self.user_11 = User.objects.create(
            email="test11@test.com",
            first_name="Eleventh User",
            last_name="lastNameTest11",
            is_passenger=True,
            is_driver=False,
        )
        self.passenger_11 = Passenger.objects.create(user=self.user_11)

        # Conductor
        self.user_12 = User.objects.create(
            email="test12@test.com",
            first_name="Twelveth User",
            last_name="lastNameTest12",
            is_passenger=True,
            is_driver=True,
        )
        self.passenger_12 = Passenger.objects.create(user=self.user_12)
        self.driver_12 = Driver.objects.create(user=self.user_12)

        # Origen driver
        self.location_origin_12 = Location.objects.create(
            address="Mi casa", latitude=200.1231231, longitude=200.11118945
        )

        # Destino driver
        self.location_destination_12 = Location.objects.create(
            address="Mi casa", latitude=200.1231231, longitude=200.11118945
        )

        # Driver routine
        self.driver_routine_12 = DriverRoutine.objects.create(
            driver=self.driver_12,
            price=1,
            is_recurrent=True,
            available_seats=1,
            departure_time_start=datetime.datetime.now().time(),
            departure_time_end=datetime.datetime.now().time(),
            arrival_time=datetime.datetime.now().time(),
            origin=self.location_origin_8,
            destination=self.location_destination_8,
            day_of_week="Tue",
        )

        # Trip
        self.trip_12 = Trip.objects.create(
            driver_routine=self.driver_routine_8,
            departure_datetime=datetime.datetime.now() + datetime.timedelta(days=1),
            arrival_datetime=datetime.datetime.now()
            + datetime.timedelta(days=1, hours=1),
            status="PENDING",
        )

        # Origen pasajero
        self.location_close_origin_11 = Location.objects.create(
            address="Al lado de mi casa", latitude=200.1241231, longitude=200.11118945
        )

        # Destino pasajero
        self.location_close_destination_11 = Location.objects.create(
            address="Al lado de mi casa", latitude=200.1241231, longitude=200.11118945
        )

        # Passenger Routine
        self.passenger_routine_11 = PassengerRoutine.objects.create(
            passenger=self.passenger_11,
            departure_time_start=(
                datetime.datetime.now() - datetime.timedelta(days=1)
            ).time(),
            departure_time_end=(
                datetime.datetime.now() + datetime.timedelta(days=1)
            ).time(),
            arrival_time=(datetime.datetime.now() + datetime.timedelta(days=1)).time(),
            origin=self.location_close_origin_7,
            destination=self.location_close_destination_7,
            day_of_week="Tue",
        )

    def test_get_two_trip_recommendations(self):
        self.client.force_authenticate(user=self.user_2)
        url = "/api/v1/trips/recommendations/"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(
            data[0]["driver_routine"]["origin"]["address"], "Mi casa"
        )  # Trip 3
        self.assertEqual(
            data[1]["driver_routine"]["origin"]["address"], "Mi casa"
        )  # Trip 4, similar

    def test_get_trip_recommendations_close_locations(self):
        self.client.force_authenticate(user=self.user_3)
        url = "/api/v1/trips/recommendations/"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(
            data[0]["driver_routine"]["origin"]["address"], "Mi casa"
        )  # Trip con origen similar

    def test_get_trip_recommendations_far_locations(self):
        self.client.force_authenticate(user=self.user_5)
        url = "/api/v1/trips/recommendations/"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 0)  # Ninguna recomendacion disponible

    def test_get_trip_recommendations_wrong_day(self):
        self.client.force_authenticate(user=self.user_7)
        url = "/api/v1/trips/recommendations/"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 0)  # Ninguna recomendacion disponible

    def test_get_trip_recommendations_trip_finished(self):
        self.client.force_authenticate(user=self.user_9)
        url = "/api/v1/trips/recommendations/"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 0)  # Ninguna recomendacion disponible

    def test_get_trip_recommendations_wrong_date(self):
        self.client.force_authenticate(user=self.user_11)
        url = "/api/v1/trips/recommendations/"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 0)  # Ninguna recomendacion disponible


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


class RequestTrip(TestCase):
    def setUp(self):
        self.client = APIClient()
        load_complex_data(self)
        self.balance = Balance.objects.create(user=self.user_2, amount=100)
        self.client.force_authenticate(user=self.user_2)

    def test_request_trip_balance(self):
        url = "/api/v1/trips/" + str(self.trip.id) + "/request/"
        response = self.client.post(
            url, data={"payment_method": "Balance", "note": "I need a ride"}
        )

        self.assertEqual(response.status_code, 201)

    def test_request_trip_card(self):
        url = "/api/v1/trips/" + str(self.trip.id) + "/request/"
        response = self.client.post(
            url,
            data={
                "payment_method": "CreditCard",
                "note": "I need a ride",
                "credit_car_number": "4242424242424242",
                "expiration_month": 12,
                "expiration_year": 2023,
                "cvc": "123",
            },
        )

        self.assertEqual(response.status_code, 201)

    def test_request_trip_paypal(self):
        url = "/api/v1/trips/" + str(self.trip.id) + "/request/"
        response = self.client.post(
            url, data={"payment_method": "PayPal", "note": "I need a ride"}
        )

        self.assertEqual(response.status_code, 201)
