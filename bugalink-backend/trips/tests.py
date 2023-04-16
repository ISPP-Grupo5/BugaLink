
from datetime import time, datetime, timedelta

import json

from django.test import TestCase
from passenger_routines.models import PassengerRoutine
from ratings.models import DriverRating
from rest_framework.test import APIClient
from locations.models import Location
from trips.models import Trip, TripRequest
from driver_routines.models import DriverRoutine
from users.tests import load_complex_data
from payment_methods.models import Balance



def load_trips_extra_data(self):
    '''
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
    '''
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
        address = "Mi otra casa",
        latitude = 50.1231231,
        longitude = 123.11118945
    )
    self.location_4 = Location.objects.create(
        address = "Escuela",
        latitude = 61.1223121231,
        longitude = 14.467800675
    )
    self.driver_routine_2 = DriverRoutine.objects.create(
        driver = self.driver_2,
        price = 60,
        is_recurrent=True,
        available_seats=1,
        departure_time_start = datetime(2022, 2, 21, 14, 0).time(),
        departure_time_end = datetime(2022, 2, 21, 15, 0).time(),
        arrival_time = datetime(2022, 2, 21, 14, 0).time(),
        origin = self.location_1,
        destination = self.location_2,
        day_of_week = "Tue",
    )
    self.driver_routine_3 = DriverRoutine.objects.create(
        driver = self.driver_2,
        price = 1,
        is_recurrent=True,
        available_seats=1,
        departure_time_start = datetime(2022, 2, 22, 13, 0).time(),
        departure_time_end = datetime(2022, 2, 22, 14, 0).time(),
        arrival_time = datetime(2022, 2, 22, 14, 0).time(),
        origin = self.location_3,
        destination = self.location_4,
        day_of_week = "Sun",
    )
    self.trip_3 = Trip.objects.create(
        driver_routine = self.driver_routine_2,
        departure_datetime = datetime(2022, 2, 21, 14, 0),
        arrival_datetime = datetime(2022, 2, 21, 15, 0),
        status="FINISHED"
    )
    self.trip_4 = Trip.objects.create(
        driver_routine = self.driver_routine_2,
        departure_datetime = datetime(2022, 2, 21, 14, 0),
        arrival_datetime = datetime(2022, 2, 21, 15, 0),
        status="PENDING"
    )
    self.trip_5 = Trip.objects.create(
        driver_routine = self.driver_routine_3,
        departure_datetime = datetime(2022, 2, 22, 13, 0),
        arrival_datetime = datetime(2022, 2, 22, 14, 0),
        status="FINISHED"
    )
    self.trip_6 = Trip.objects.create(
        driver_routine = self.driver_routine_3,
        departure_datetime = datetime(2022, 2, 22, 13, 0),
        arrival_datetime = datetime(2022, 2, 22, 14, 0),
        status="PENDING"
    )
    self.trip_request_3 = TripRequest.objects.create(
        trip = self.trip_3,
        status = "ACCEPTED",
        passenger = self.passenger_2,
        price=1.2
    )  
    self.trip_request_4 = TripRequest.objects.create(
        trip = self.trip_4,
        status = "PENDING",
        passenger = self.passenger_2,
        price=1.2
    )
    self.trip_request_5 = TripRequest.objects.create(
        trip = self.trip_5,
        status = "ACCEPTED",
        passenger = self.passenger_2,
        price=1.2
    )  
    self.trip_request_6 = TripRequest.objects.create(
        trip = self.trip_6,
        status = "PENDING",
        passenger = self.passenger_2,
        price=1.2
    )
    DriverRating.objects.create(trip_request=self.trip_request, rating=1.0)        
    DriverRating.objects.create(trip_request=self.trip_request_3, rating=4.0)  

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
        load_trips_extra_data(self)
        self.client.force_authenticate(user=self.user)

    # Encuentra bien dos viajes específicos
    def test_get_trips_by_search(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data), 2)  # cantidad de viajes obtenidos
        self.assertEqual(data[1]["id"], self.trip_2.id)
        self.assertEqual(data[0]["id"], self.trip_4.id)
        
    # Error por no indicar localizaciones
    def test_get_no_trips_location_error(self):
        url = "/api/v1/trips/search/"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(response.status_code, 400)
        
    # Error por no indicar origen
    def test_get_no_trips_origin_error(self):
        url = "/api/v1/trips/search/?destination=41.1223121231,14.467800675"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(response.status_code, 400)
        
    # Error por no indicar destino
    def test_get_no_trips_destination_error(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945"
        response = self.client.get(url)
        data = json.loads(response.content)
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
        data = json.loads(response.content)
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
        data = json.loads(response.content)
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
        data = json.loads(response.content)
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
    def test_get_no_trips_date_error(self):
        url = "/api/v1/trips/search/?origin=45.1231231,123.11118945&destination=41.1223121231,14.467800675&hour_from=helloworld&date_to=helloworld"
        response = self.client.get(url)
        data = json.loads(response.content)
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
        data = json.loads(response.content)
        self.assertEqual(response.status_code, 400)


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
        response = self.client.post(url, data ={"payment_method": "Balance", "note": "I need a ride"})
        
        self.assertEqual(response.status_code, 201)
    
    def test_request_trip_card(self):
        url = "/api/v1/trips/" + str(self.trip.id) + "/request/"
        response = self.client.post(url, data ={"payment_method": "CreditCard", 
                                                "note": "I need a ride", 
                                                "credit_car_number" : "4242424242424242",
                                                "expiration_month": 12,
                                                "expiration_year": 2023,
                                                "cvc": "123"})
        
        self.assertEqual(response.status_code, 201)
    
    def test_request_trip_paypal(self):
        url = "/api/v1/trips/" + str(self.trip.id) + "/request/"
        response = self.client.post(url, data ={"payment_method": "PayPal", 
                                                "note": "I need a ride"})
        
        self.assertEqual(response.status_code, 201)