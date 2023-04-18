
from datetime import time, datetime, timedelta

import json

from django.test import TestCase
from driver_routines.models import DriverRoutine
from drivers.models import Driver
from locations.models import Location
from passenger_routines.models import PassengerRoutine
from passengers.models import Passenger
from payment_methods.models import Balance
from ratings.models import DriverRating, Report
from rest_framework.test import APIClient
from locations.models import Location
from trips.models import Trip, TripRequest
from users.models import User
from driver_routines.models import DriverRoutine
from users.tests import load_complex_data
from payment_methods.models import Balance
from passengers.models import Passenger




def load_passenger_routines_extra_data(self):
    '''
    Crea:
    * self.passenger_routine para self.passenger, con día de rutina Lunes
    '''
    load_complex_data(self)
    
    # Nuevas entidades
    self.passenger_routine = PassengerRoutine.objects.create(
        passenger=self.passenger,
        departure_time_start=datetime.now().time(),
        departure_time_end=datetime.now().time(),
        arrival_time=datetime.now().time(),
        origin = self.location_1,
        destination = self.location_2,
        day_of_week = "Mon"
    )

class PassengerRoutineTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        load_passenger_routines_extra_data(self)
        self.client.force_authenticate(user=self.user)
        
    # Actualiza con éxito una rutina
    def test_put_passenger_routine(self):
        url = "passenger-routines/" + str(self.passenger_routine.id) + "/update/"
        new_departure_time_start = datetime(2022, 2, 21, 14, 0).time()
        new_departure_time_end = datetime(2022, 2, 21, 15, 0).time()
        new_arrival_time = datetime(2022, 2, 21, 16, 0).time()
        body = {
            "departure_time_start" : new_departure_time_start,
            "departure_time_end" : new_departure_time_end,
            "arrival_time" : new_arrival_time,
        }
        response = self.client.put(url, data=body)
        passenger_routine = PassengerRoutine.objects.get(id=self.passenger_routine.id)
        self.assertEqual(passenger_routine.departure_time_start, new_departure_time_start)
        self.assertEqual(passenger_routine.departure_time_start, new_departure_time_end)
        self.assertEqual(passenger_routine.departure_time_start, new_arrival_time)