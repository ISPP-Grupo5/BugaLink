import json
from datetime import datetime, time, timedelta

from django.test import TestCase
from driver_routines.models import DriverRoutine
from drivers.models import Driver
from locations.models import Location
from passenger_routines.models import PassengerRoutine
from passengers.models import Passenger
from payment_methods.models import Balance
from ratings.models import DriverRating, Report
from rest_framework.test import APIClient
from trips.models import Trip, TripRequest
from users.models import User
from users.tests import load_complex_data


def load_trips_extra_data(self):
    """
    Crea:
    * self.driver_routine_2 para self.driver_2, con día de rutina Martes
    * self.driver_routine_3 para self.driver_2, con día de rutina Domingo
    * self.location_3 y self.location_4 para driver_routine_3
    * self.trip_3(FINISHED) y self.trip_4(PENDING) para self.driver_routine_2
    * self.trip_5(FINISHED) y self.trip_6(PENDING) para self.driver_routine_3
    * self.trip_request_3(ACCEPTED) para passenger_2 en self.trip_3
    * self.trip_request_4(PENDING) para passenger_2 en self.trip_4
    * self.trip_request_5(ACCEPTED) para passenger_2 en self.trip_5
    * self.trip_request_6(PENDING) para passenger_2 en self.trip_6
    * DriverRatings con 1 estrella para trip_request
    * DriverRatings con 4 estrellas para trip_request_3
    """
    load_complex_data(self)

    # Actualizar atributos de entidades creadas en load_complex_data
    self.driver_2.prefers_talk = True
    self.driver_2.allows_smoke = True
    self.driver_2.save()

    self.driver_routine.departure_time_start = datetime(2022, 2, 20, 13, 0).time()
    self.driver_routine.departure_time_end = datetime(2022, 2, 20, 13, 0).time()
    self.driver_routine.arrival_time = datetime(2022, 2, 20, 14, 0).time()
    self.driver_routine.save()

    self.trip.departure_datetime = datetime(2022, 2, 20, 13, 0)
    self.trip.arrival_datetime = datetime(2022, 2, 20, 14, 0)
    self.trip.save()

    self.trip_2.departure_datetime = datetime(2022, 2, 20, 13, 0)
    self.trip_2.arrival_datetime = datetime(2022, 2, 20, 14, 0)
    self.trip_2.save()

    # Nuevas entidades
    self.location_3 = Location.objects.create(
        address="Mi otra casa", latitude=50.1231231, longitude=123.11118945
    )
    self.location_4 = Location.objects.create(
        address="Escuela", latitude=61.1223121231, longitude=14.467800675
    )
    self.driver_routine_2 = DriverRoutine.objects.create(
        driver=self.driver_2,
        price=60,
        is_recurrent=True,
        available_seats=1,
        departure_time_start=datetime(2022, 2, 21, 14, 0).time(),
        departure_time_end=datetime(2022, 2, 21, 15, 0).time(),
        arrival_time=datetime(2022, 2, 21, 14, 0).time(),
        origin=self.location_1,
        destination=self.location_2,
        day_of_week="Tue",
    )
    self.driver_routine_3 = DriverRoutine.objects.create(
        driver=self.driver_2,
        price=1,
        is_recurrent=True,
        available_seats=1,
        departure_time_start=datetime(2022, 2, 22, 13, 0).time(),
        departure_time_end=datetime(2022, 2, 22, 14, 0).time(),
        arrival_time=datetime(2022, 2, 22, 14, 0).time(),
        origin=self.location_3,
        destination=self.location_4,
        day_of_week="Sun",
    )
    self.trip_3 = Trip.objects.create(
        driver_routine=self.driver_routine_2,
        departure_datetime=datetime(2022, 2, 21, 14, 0),
        arrival_datetime=datetime(2022, 2, 21, 15, 0),
        status="FINISHED",
    )
    self.trip_4 = Trip.objects.create(
        driver_routine=self.driver_routine_2,
        departure_datetime=datetime(2022, 2, 21, 14, 0),
        arrival_datetime=datetime(2022, 2, 21, 15, 0),
        status="PENDING",
    )
    self.trip_5 = Trip.objects.create(
        driver_routine=self.driver_routine_3,
        departure_datetime=datetime(2022, 2, 22, 13, 0),
        arrival_datetime=datetime(2022, 2, 22, 14, 0),
        status="FINISHED",
    )
    self.trip_6 = Trip.objects.create(
        driver_routine=self.driver_routine_3,
        departure_datetime=datetime(2022, 2, 22, 13, 0),
        arrival_datetime=datetime(2022, 2, 22, 14, 0),
        status="PENDING",
    )
    self.trip_request_3 = TripRequest.objects.create(
        trip=self.trip_3, status="ACCEPTED", passenger=self.passenger_2, price=1.2
    )
    self.trip_request_4 = TripRequest.objects.create(
        trip=self.trip_4, status="PENDING", passenger=self.passenger_2, price=1.2
    )
    self.trip_request_5 = TripRequest.objects.create(
        trip=self.trip_5, status="ACCEPTED", passenger=self.passenger_2, price=1.2
    )
    self.trip_request_6 = TripRequest.objects.create(
        trip=self.trip_6, status="PENDING", passenger=self.passenger_2, price=1.2
    )
    DriverRating.objects.create(trip_request=self.trip_request, rating=1.0)
    DriverRating.objects.create(trip_request=self.trip_request_3, rating=4.0)


class GetTripRecommendationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        load_complex_data(self)

        # Viaje de test unitario original
        self.trip_3 = Trip.objects.create(
            driver_routine=self.driver_routine,
            departure_datetime=datetime.now() + timedelta(days=1),
            arrival_datetime=datetime.now() + timedelta(days=1, hours=1),
            status="PENDING",
        )

        # Viaje similar asociado a una misma rutina, para devolucion de varios viajes
        self.trip_4 = Trip.objects.create(
            driver_routine=self.driver_routine,
            departure_datetime=datetime.now() + timedelta(days=1),
            arrival_datetime=datetime.now() + timedelta(days=1, hours=1),
            status="PENDING",
        )

        # Rutina con datos similares a la del driver
        self.passenger_routine_1 = PassengerRoutine.objects.create(
            passenger=self.passenger_2,
            departure_time_start=(datetime.now() - timedelta(hours=1)).time(),
            departure_time_end=(datetime.now() + timedelta(hours=1)).time(),
            arrival_time=(datetime.now() + timedelta(hours=1)).time(),
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
            departure_time_start=datetime.now().time(),
            departure_time_end=datetime.now().time(),
            arrival_time=datetime.now().time(),
            origin=self.location_origin_4,
            destination=self.location_destination_4,
            day_of_week="Mon",
        )

        # Trip
        self.trip_5 = Trip.objects.create(
            driver_routine=self.driver_routine_4,
            departure_datetime=datetime.now() + timedelta(days=1),
            arrival_datetime=datetime.now() + timedelta(days=1, hours=1),
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
            departure_time_start=(datetime.now() - timedelta(hours=1)).time(),
            departure_time_end=(datetime.now() + timedelta(hours=1)).time(),
            arrival_time=(datetime.now() + timedelta(hours=1)).time(),
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
            departure_time_start=datetime.now().time(),
            departure_time_end=datetime.now().time(),
            arrival_time=datetime.now().time(),
            origin=self.location_origin_6,
            destination=self.location_destination_6,
            day_of_week="Mon",
        )

        # Trip
        self.trip_6 = Trip.objects.create(
            driver_routine=self.driver_routine_6,
            departure_datetime=datetime.now() + timedelta(days=1),
            arrival_datetime=datetime.now() + timedelta(days=1, hours=1),
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
            departure_time_start=(datetime.now() - timedelta(hours=1)).time(),
            departure_time_end=(datetime.now() + timedelta(hours=1)).time(),
            arrival_time=(datetime.now() + timedelta(hours=1)).time(),
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
            departure_time_start=datetime.now().time(),
            departure_time_end=datetime.now().time(),
            arrival_time=datetime.now().time(),
            origin=self.location_origin_8,
            destination=self.location_destination_8,
            day_of_week="Mon",
        )

        # Trip
        self.trip_8 = Trip.objects.create(
            driver_routine=self.driver_routine_8,
            departure_datetime=datetime.now() + timedelta(days=1),
            arrival_datetime=datetime.now() + timedelta(days=1, hours=1),
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
            departure_time_start=(datetime.now() - timedelta(hours=1)).time(),
            departure_time_end=(datetime.now() + timedelta(hours=1)).time(),
            arrival_time=(datetime.now() + timedelta(hours=1)).time(),
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
            departure_time_start=datetime.now().time(),
            departure_time_end=datetime.now().time(),
            arrival_time=datetime.now().time(),
            origin=self.location_origin_8,
            destination=self.location_destination_8,
            day_of_week="Tue",
        )

        # Trip
        self.trip_10 = Trip.objects.create(
            driver_routine=self.driver_routine_8,
            departure_datetime=datetime.now() + timedelta(days=1),
            arrival_datetime=datetime.now() + timedelta(days=1, hours=1),
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
            departure_time_start=(datetime.now() - timedelta(hours=1)).time(),
            departure_time_end=(datetime.now() + timedelta(hours=1)).time(),
            arrival_time=(datetime.now() + timedelta(hours=1)).time(),
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
            departure_time_start=datetime.now().time(),
            departure_time_end=datetime.now().time(),
            arrival_time=datetime.now().time(),
            origin=self.location_origin_8,
            destination=self.location_destination_8,
            day_of_week="Tue",
        )

        # Trip
        self.trip_12 = Trip.objects.create(
            driver_routine=self.driver_routine_8,
            departure_datetime=datetime.now() + timedelta(days=1),
            arrival_datetime=datetime.now() + timedelta(days=1, hours=1),
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
            departure_time_start=(datetime.now() - timedelta(days=1)).time(),
            departure_time_end=(datetime.now() + timedelta(days=1)).time(),
            arrival_time=(datetime.now() + timedelta(days=1)).time(),
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
        load_trips_extra_data(self)
        self.client.force_authenticate(user=self.user)

    # Error por no indicar localizaciones
    def test_get_no_trips_location_error(self):
        url = "/api/v1/trips/search/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 400)

    # Error por no indicar origen
    def test_get_no_trips_origin_error(self):
        url = "/api/v1/trips/search/?destination=41.1223121231,14.467800675"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 400)

    # Error por no indicar destino
    def test_get_no_trips_destination_error(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 400)

    # Filtrando por localización, no encuentra viajes
    def test_get_no_trips_filter_by_location(self):
        url = "/api/v1/trips/search/?origin=30.1231231,123.11118945&destination=41.1223121231,14.467800675"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 0)  # cantidad de viajes obtenidos

    # Filtrando por localización, encuentra dos viajes
    def test_get_trips_filter_by_location(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 2)  # cantidad de viajes obtenidos
        self.assertEqual(data[1]["id"], self.trip_2.id)
        self.assertEqual(data[0]["id"], self.trip_4.id)

    # Filtrando por localización, encuentra un viaje
    def test_get_trip_filter_by_location(self):
        url = "/api/v1/trips/search/?origin=50.1231231,123.11118945&destination=61.1223121231,14.467800675"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 1)  # cantidad de viajes obtenidos
        self.assertEqual(data[0]["id"], self.trip_6.id)

    # Filtrando por localización, no es la localización exacta, encuentra un viaje
    def test_get_trip_filter_by_near_location(self):
        url = "/api/v1/trips/search/?origin=50.1201231,123.11118945&destination=61.1223121231,14.467800675"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 1)  # cantidad de viajes obtenidos
        self.assertEqual(data[0]["id"], self.trip_6.id)

    # Filtrando por día de la semana, encuentra un viaje
    def test_get_trip_filter_by_day(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&days=Mon"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 1)  # cantidad de viajes obtenidos
        self.assertEqual(data[0]["id"], self.trip_2.id)

    # Filtrando por día de la semana, encuentra otro viaje
    def test_get_trip_filter_by_day_2(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&days=Tue"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 1)  # cantidad de viajes obtenidos
        self.assertEqual(data[0]["id"], self.trip_4.id)

    # Filtrando por día de la semana, encuentra dos viajes
    def test_get_trips_filter_by_day(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&days=Mon,Tue"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 2)  # cantidad de viajes obtenidos
        self.assertEqual(data[1]["id"], self.trip_2.id)
        self.assertEqual(data[0]["id"], self.trip_4.id)

    # Filtrando por día de la semana, no encuentra viajes
    def test_get_no_trips_filter_by_day(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&days=Wed"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 0)  # cantidad de viajes obtenidos

    # Filtrando por día de la semana no existente, no encuentra viajes
    def test_get_no_trips_filter_by_fake_day(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&days=Monday"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 0)  # cantidad de viajes obtenidos

    # Filtrando por estrellas, encuentra sólo un viaje
    def test_get_trips_filter_by_stars(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&min_stars=3."
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 1)  # cantidad de viajes obtenidos
        self.assertEqual(data[0]["id"], self.trip_4.id)

    # Filtrando por estrellas, no encuentra ningún viaje
    def test_get_no_trips_filter_by_stars(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&min_stars=5."
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 0)  # cantidad de viajes obtenidos

    # Error por indicar un dato erróneo en el número de estrellas
    def test_get_no_trips_stars_error(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&min_stars=helloworld"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 400)

    # Filtrando por precio, encuentra dos viajes
    def test_get_trips_filter_by_price(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&min_price=0.&max_price=100."
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 2)  # cantidad de viajes obtenidos
        self.assertEqual(data[1]["id"], self.trip_2.id)
        self.assertEqual(data[0]["id"], self.trip_4.id)

    # Filtrando por precio, encuentra un viaje
    def test_get_trip_filter_by_price(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&min_price=0.&max_price=50."
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 1)  # cantidad de viajes obtenidos
        self.assertEqual(data[0]["id"], self.trip_2.id)

    # Filtrando por precio, no encuentra viajes
    def test_get_no_trips_filter_by_price(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&min_price=0.&max_price=0."
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 0)  # cantidad de viajes obtenidos

    # Error por indicar un dato erróneo en el precio
    def test_get_no_trips_price_error(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&min_price=helloworld&max_price=helloworld"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 400)

    # Filtrando por fecha, encuentra dos viajes
    def test_get_trips_filter_by_date(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&date_from=2022-02-20&date_to=2022-02-21"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 2)  # cantidad de viajes obtenidos
        self.assertEqual(data[1]["id"], self.trip_2.id)
        self.assertEqual(data[0]["id"], self.trip_4.id)

    # Filtrando por fecha, encuentra un viaje
    def test_get_trip_filter_by_date(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&date_from=2022-02-20&date_to=2022-02-20"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 1)  # cantidad de viajes obtenidos
        self.assertEqual(data[0]["id"], self.trip_2.id)

    # Filtrando sólo por fecha inicial, encuentra un viaje
    def test_get_trips_filter_by_date_from(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&date_from=2022-02-21"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 1)  # cantidad de viajes obtenidos
        self.assertEqual(data[0]["id"], self.trip_4.id)

    # Filtrando sólo por fecha final, encuentra un viaje
    def test_get_trips_filter_by_date_to(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&date_to=2022-02-20"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 1)  # cantidad de viajes obtenidos
        self.assertEqual(data[0]["id"], self.trip_2.id)

    # Filtrando por fecha, no encuentra un viaje
    def test_get_no_trips_filter_by_date(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&date_from=2022-02-22&date_to=2022-02-22"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 0)  # cantidad de viajes obtenidos

    # Error por formato incorrecto en fecha
    def test_get_no_trips_date_error(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&date_from=helloworld&date_to=helloworld"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 400)

    # Filtrando por horas, encuentra dos viajes
    def test_get_trips_filter_by_hour(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&hour_from=12:00&hour_to=15:00"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 2)  # cantidad de viajes obtenidos
        self.assertEqual(data[1]["id"], self.trip_2.id)
        self.assertEqual(data[0]["id"], self.trip_4.id)

    # Filtrando por horas, encuentra un viaje
    def test_get_trip_filter_by_hour(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&hour_from=12:00&hour_to=13:00"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 1)  # cantidad de viajes obtenidos
        self.assertEqual(data[0]["id"], self.trip_2.id)

    # Filtrando por horas, no encuentra viajes
    def test_get_no_trips_filter_by_hour(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&hour_from=11:00&hour_to=12:00"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 0)  # cantidad de viajes obtenidos

    # Error por formato incorrecto en horas
    def test_get_no_trips_hour_error(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&hour_from=helloworld&date_to=helloworld"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 400)

    # Filtrando por preferencias, encuentra dos viajes
    def test_get_trips_filter_by_preferences(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&prefers_music=False&allows_pets=False"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 2)  # cantidad de viajes obtenidos
        self.assertEqual(data[1]["id"], self.trip_2.id)
        self.assertEqual(data[0]["id"], self.trip_4.id)

    # Filtrando por preferencias, encuentra un viaje
    def test_get_trip_filter_by_preferences(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&prefers_music=False&prefers_talk=False&allows_pets=False&allows_smoke=False"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 1)  # cantidad de viajes obtenidos
        self.assertEqual(data[0]["id"], self.trip_2.id)

    # Filtrando por preferencias, no encuentra un viaje
    def test_get_no_trips_filter_by_preferences(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&prefers_music=True"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 0)  # cantidad de viajes obtenidos

    # Error por formato incorrecto en preferencias
    def test_get_no_trips_preference_error(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&prefers_music=helloworld"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 400)


""" DONT WORK - PLEASE CHECK THIS OUT ABRAHAM
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
"""

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
                "note": "note",
            },
        )
        self.assertEqual(Report.objects.get(id=1).note, "note")

    def test_report_trip_get_users(self):
        url = "/api/v1/trips/" + str(self.trip.id) + "/users/"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data.get("users")), 2)
