from datetime import time, datetime
from django.test import TestCase
from django.contrib.auth.models import User
from .models import *
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.core.files.uploadedfile import SimpleUploadedFile
import json



### IMPORTANTE ###
'''
Para que los tests ejecuten bien django crea una base de datos de prueba para tests, y luego la elimina. El problema es que
el usuario de postgres que hay especificado en config.env no tiene por defecto permisos para crear bases de datos, por lo que 
da error. Esto se soluciona entrando por consola a postgres "psql -U <user_admin>" 
Para mas info mirar semana 4 > guia configuración backend 

Una vez dentro, hay que hacer  `ALTER USER <nombre_usuario_de_config.env> CREATEDB;` y ya tendría permisos
'''

def load_data(self):
    self.user1 = User.objects.create(username="TEST USER1", email="test1@test.es")
    self.passenger1 = Passenger.objects.create(user=self.user1, balance=0.0)
    self.user2 = User.objects.create(username="TEST USER2", email="test2@test.es")
    self.passenger2 = Passenger.objects.create(user=self.user2, balance=0.0)
    self.driver1 = Driver.objects.create(passenger=self.passenger1)
    self.vehicle1 = Vehicle.objects.create(driver=self.driver1)
    self.driver_routine1 = DriverRoutine.objects.create(driver=self.driver1,
                                                        default_vehicle=self.vehicle1,default_num_seats=4,
                                                        start_date_0=time(12,00),
                                                        start_date_1=time(12,30),
                                                        end_date=time(13,00),
                                                        start_location="Virgen de Lujan 120",
                                                        end_location="Paseo de las Delicias S/N",
                                                        day=Days.Mon,
                                                        one_ride=True,
                                                        price=2.0)
    self.passenger_routine1 = PassengerRoutine.objects.create(passenger=self.passenger1,start_time_initial=time(12,00),
                                                                start_time_final=time(12,30),
                                                                end_date=time(13,00),
                                                                start_location="Virgen de Lujan 120",
                                                                end_location="Paseo de las Delicias S/N",
                                                                day=Days.Mon)

    self.ride1 = Ride.objects.create(driver_routine=self.driver_routine1,
                                        num_seats=self.driver_routine1.default_num_seats,
                                        start_date = datetime(2020,4,7,14,0,0),
                                        end_date =datetime(2020,4,7,15,0,0),
                                        start_location = self.driver_routine1.start_location,
                                        end_location = self.driver_routine1.end_location
                                        )
    self.individual_ride1 = IndividualRide.objects.create(ride=self.ride1,
                                                            passenger=self.passenger2,
                                                            n_seats=1,
                                                            acceptation_status="Accepted")

class ModelTest(TestCase):
    def setUp(self):

        # CREATE USER 
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass'
        )
        
        self.photo=None
        # self.photo = SimpleUploadedFile(
        #     name='test_photo.jpg',
        #     content=open("bugalinkapp/test/test_photo.jpg", 'rb').read(),
        #     content_type='image/jpeg'
        # )

        # CREATE PASSENGER
        self.passenger = Passenger.objects.create(
            user=self.user,
            # city='Test City',
            # province='Test Province',
            # biography='Test Biography',
            # birth_date='1990-01-01',
            balance=100.00,
            photo=self.photo,
            verified=False
        )
        
        self.sworn_declaration = None
        # self.sworn_declaration = SimpleUploadedFile(
        #     name='sworn_declaration.pdf',
        #     content=open("bugalinkapp/test/sworn_declaration.pdf", 'rb').read(),
        #     content_type='application/pdf'
        # )
        self.driver_license = None
        # self.driver_license = SimpleUploadedFile(
        #     name='driver_license.jpg',
        #     content=open("bugalinkapp/test/driver_license.jpg", 'rb').read(),
        #     content_type='image/jpeg'
        # )
        self.dni_front = None
        # self.dni_front = SimpleUploadedFile(
        #     name='dni_front.jpg',
        #     content=open("bugalinkapp/test/dni_front.jpg", 'rb').read(),
        #     content_type='image/jpeg'
        # )
        self.dni_back = None
        # self.dni_back = SimpleUploadedFile(
        #     name='dni_front.jpg',
        #     content=open("bugalinkapp/test/dni_front.jpg", 'rb').read(),
        #     content_type='image/jpeg'
        # )

        # CREATE DRIVER
        self.driver = Driver.objects.create(
            passenger=self.passenger,
            # preferences='Test Preferences',
            # biography='Test Biography',
            # has_driver_license=True,
            # has_sworn_declaration=True,
            entry_date='2022-03-11',
            sworn_declaration= self.sworn_declaration,
            driver_license=self.driver_license,
            dni_front=self.dni_front,
            dni_back=self.dni_back
        )

        #RATING  HA CAMBIADO CON EL V3
        #self.rating = Rating.objects.create(
        #    driver= Driver.objects.first(),
        #    passenger=Passenger.objects.first(),
        #    value=4.5,
        #    comment='Test Comment',
        #)


        # self.insurance_file = SimpleUploadedFile(
        #     name='test_insurance.pdf',
        #     content=b'Test insurance file contents',
        #     content_type='application/pdf'
        # )

        #VEHICLE
        # self.vehicle = Vehicle.objects.create(
        #     driver = self.driver,
        #     model='Test Model',
        #     plate='Test Plate',
        #     has_insurance=True,
        #     insurance=self.insurance_file
        # )

    # Esto permite borrar los archivos "subidos"
    def tearDown(self):         
        self.passenger.photo.delete()
        self.driver.dni_front.delete()
        self.driver.dni_back.delete()
        self.driver.driver_license.delete()
        self.driver.sworn_declaration.delete()
        # self.vehicle.insurance.delete()
    
    ######### EMPIEZA EL TESTING ###################

    def test_passenger_creation(self):
        self.assertIsInstance(self.passenger, Passenger)
        # self.assertEqual(self.passenger.city, 'Test City')
        # self.assertEqual(self.passenger.province, 'Test Province')
        # self.assertEqual(self.passenger.biography, 'Test Biography')
        # self.assertEqual(str(self.passenger.birth_date), '1990-01-01')
        self.assertEqual(self.passenger.balance, 100.00)
        # self.assertIsNotNone(self.passenger.photo)  # Ensure file is not None
        self.assertFalse(self.passenger.verified)

    def test_driver_creation(self):
        self.assertIsInstance(self.driver, Driver)
        self.assertEqual(self.driver.passenger, self.passenger)
        # self.assertEqual(self.driver.preferences, 'Test Preferences')
        # self.assertEqual(self.driver.biography, 'Test Biography')
        # self.assertTrue(self.driver.has_driver_license)
        # self.assertTrue(self.driver.has_sworn_declaration)
        self.assertEqual(str(self.driver.entry_date), '2022-03-11')
        # self.assertEqual(self.driver.sworn_declaration.name, 'sworn_declaration.pdf')
        # self.assertIsNotNone(self.driver.driver_license.name)
        # self.assertIsNotNone(self.driver.dni_front)
    
    #def test_rating_creation(self):
    #    self.assertIsInstance(self.rating, Rating)
    #    self.assertEqual(self.rating.driver, self.rating.driver)
    #    self.assertEqual(self.rating.passenger, self.rating.passenger)
    #    self.assertAlmostEqual(self.rating.value, 4.5, places=2)
    #    self.assertEqual(self.rating.comment, 'Test Comment')

    # def test_vehicle_creation(self):
    #     self.assertEqual(self.vehicle.model, 'Test Model')
    #     self.assertEqual(self.vehicle.plate, 'Test Plate')
    #     self.assertTrue(self.vehicle.has_insurance)
    #     self.assertEqual(self.vehicle.insurance.name, 'test_insurance.pdf')


# Ejemplo de prueba para endpoint GET api/test/users/<int:userId>

class RoutineRecommendationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create(username="TEST USER", email="test@test.es")
        self.passenger1 = Passenger.objects.create(user=self.user1, balance=0.0)
        self.passengerRoutine1 = PassengerRoutine.objects.create(passenger=self.passenger1, start_time_initial='8:01', start_time_final='8:15', end_date='9:00', start_latitude=10.0, end_latitude=11.0, start_longitude=10.0, end_longitude=11.0, day='Mon')
        
        self.user2 = User.objects.create(username="TEST USER 2", email="test2@test.es")
        self.passenger2 = Passenger.objects.create(user=self.user2, balance=0.0)
        self.driver2 = Driver.objects.create(passenger=self.passenger2)
        self.driverRoutine2 = DriverRoutine.objects.create(driver=self.driver2, default_num_seats=1, start_date_0='8:00', start_date_1='8:15', end_date='9:00', start_latitude=10.0, end_latitude=11.0, start_longitude=10.0, end_longitude=11.0,day='Mon', price=10.0)
        self.ride2 = Ride.objects.create(driver_routine=self.driverRoutine2, num_seats=1, start_date='2023-03-11 8:00', end_date='2023-03-11 8:15')
        
    def tearDown(self):
        self.ride2.delete()
        self.driverRoutine2.delete()
        self.driver2.delete()
        self.passenger2.delete()
        self.user2.delete()

        self.passengerRoutine1.delete()
        self.passenger1.delete()
        self.user1.delete()

    def test_get_routine_recommendation_by_user_id(self):
        url = "/api/test/users/" + str(self.user1.pk) + "/rideRecommendation"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

class RatingTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create(username="TEST USER", email="test@test.es")
        self.passenger1 = Passenger.objects.create(user=self.user1, balance=0.0)
        self.passengerRoutine1 = PassengerRoutine.objects.create(passenger=self.passenger1, start_time_initial='8:01', start_time_final='8:15', end_date='9:00', start_latitude=10.0, end_latitude=11.0, start_longitude=10.0, end_longitude=11.0, day='Mon')


        self.user2 = User.objects.create(username="TEST USER 2", email="test2@test.es")
        self.passenger2 = Passenger.objects.create(user=self.user2, balance=0.0)
        self.driver2 = Driver.objects.create(passenger=self.passenger2)
        self.driverRoutine2 = DriverRoutine.objects.create(driver=self.driver2, default_num_seats=1, start_date_0='8:00', start_date_1='8:15', end_date='9:00', start_latitude=10.0, end_latitude=11.0, start_longitude=10.0, end_longitude=11.0,day='Mon', price=10.0)
        self.ride2 = Ride.objects.create(driver_routine=self.driverRoutine2, num_seats=1, start_date='2023-03-11 8:00', end_date='2023-03-11 8:15')
        
        self.individualRide1 = IndividualRide.objects.create(ride=self.ride2, passenger=self.passenger1, passenger_routine=self.passengerRoutine1)
        self.passengerRating1 = PassengerRating.objects.create(individual_ride=self.individualRide1, rating = 2.5)

        self.individualRide2 = IndividualRide.objects.create(ride=self.ride2, passenger=self.passenger2, passenger_routine=self.passengerRoutine1)
        self.driverRating1 = DriverRating.objects.create(individual_ride=self.individualRide2, rating = 2.5)

    def tearDown(self):
        self.driverRating1.delete()
        self.individualRide2.delete()
        self.passengerRating1.delete()
        self.individualRide1.delete()

        self.ride2.delete()
        self.driverRoutine2.delete()
        self.driver2.delete()
        self.passenger2.delete()
        self.user2.delete()

        self.passengerRoutine1.delete()
        self.passenger1.delete()
        self.user1.delete()

    def test_get_rating(self):
        url = "/api/test/users/" + str(self.user1.pk) + "/reviews/rating"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

class GetTest(TestCase):
    # Se inicializan datos para que se puedan devolver
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create(username="TEST USER", email="test@test.es")
        self.passenger1 = Passenger.objects.create(user=self.user1, balance=0.0)

    # Se borran las instancias creadas, aunque teoricamente si se usa una bd para tests no haría falta
    def tearDown(self):    
        self.passenger1.delete()
        self.user1.delete()
       

    def test_get_user_by_id(self):
        url = "/api/test/users/" + str(self.user1.pk)
        response = self.client.get(url)

        # este comando parsea la JsonResponse a un diccionario para poder acceder a los valores
        data = json.loads(response.content)

        # Se hacen las comprobaciones
        self.assertEqual(data['user'],self.user1.pk)


# Testing del endpoint POST api/test/reviews
class PostTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        load_data(self)
        
    def test_post_passenger_routine(self):
        body = {
                    "passenger": str(self.passenger1.pk),
                    "start_longitude": -77.0366,
                    "start_latitude": 38.8951,
                    "end_longitude": -76.6183,
                    "end_latitude": 39.2904,
                    "start_location": "Washington D.C.",
                    "end_location": "Baltimore, MD",
                    "day": "Mon",
                    "end_date": "18:00:00",
                    "start_time_initial": "07:00:00",
                    "start_time_final": "09:00:00"
                }
        url = "/api/users/passenger-routines"
        response = self.client.post(url, data=body)

        # este comando parsea la JsonResponse a un diccionario para poder acceder a los valores
        data = json.loads(response.content)

        # Se hacen las comprobaciones
        self.assertAlmostEqual(float(data['start_longitude']), float(-77.0366), places=10)
        self.assertAlmostEqual(float(data['start_latitude']), float(38.8951), places=10)
        self.assertAlmostEqual(float(data['end_longitude']), float(-76.6183), places=10)
        self.assertAlmostEqual(float(data['end_latitude']), float(39.2904), places=10)
        self.assertEqual(data['start_location'],"Washington D.C.")
        self.assertEqual(data['end_location'],"Baltimore, MD")
        self.assertEqual(data['day'],"Mon")
        self.assertEqual(data['end_date'],"18:00:00")
        self.assertEqual(data['start_time_initial'],"07:00:00")
        self.assertEqual(data['start_time_final'],"09:00:00")

    def test_post_driver_routine(self):
        body = {
                    "driver": str(self.driver1.pk),
                    "default_vehicle_id":1,
                    "default_num_seats": 3,
                    "start_date_0": "08:00:00",
                    "start_date_1": "08:30:00",
                    "end_date": "18:00:00",
                    "start_longitude": -74.0059,
                    "start_latitude": 40.7128,
                    "end_longitude": -73.935242,
                    "end_latitude": 40.730610,
                    "start_location": "New York City, NY, USA",
                    "end_location": "Brooklyn, NY, USA",
                    "day": "Mon",
                    "one_ride": False,
                    "price": 25.99,
                    "driver_note": "Las ventanas no se abren"
                }
        url = "/api/users/driver-routines"
        response = self.client.post(url, data=body)

        # este comando parsea la JsonResponse a un diccionario para poder acceder a los valores
        data = json.loads(response.content)

        # Se hacen las comprobaciones
        self.assertEqual(data['default_num_seats'],3)
        self.assertEqual(data['start_date_0'],"08:00:00")
        self.assertEqual(data['start_date_1'],"08:30:00")
        self.assertEqual(data['end_date'],"18:00:00")
        self.assertAlmostEqual(float(data['start_longitude']), float(-74.0059), places=10)
        self.assertAlmostEqual(float(data['start_latitude']), float(40.7128), places=10)
        self.assertAlmostEqual(float(data['end_longitude']), float(-73.935242), places=10)
        self.assertAlmostEqual(float(data['end_latitude']), float(40.730610), places=10)
        self.assertEqual(data['start_location'],"New York City, NY, USA")
        self.assertEqual(data['end_location'],"Brooklyn, NY, USA")
        self.assertEqual(data['day'],"Mon")
        self.assertFalse(data['one_ride'])
        self.assertEqual(str(data['price']), '25.99')
        self.assertEqual(data['driver_note'], "Las ventanas no se abren")

    def tearDown(self):    
        self.driver1.delete()
        self.passenger1.delete()
        self.user1.delete()  

    def test_post_review(self):
        body = {
                "individualRideId": str(self.individual_ride1.pk),
                'rating_type' : "driver",
                'driverId' : str(self.driver1.pk),
                'passengerId' : str(self.passenger2.pk),
                "rating": 4.0,
                "preference0": True,
                "preference1": True,
                "preference2": False,
            }
        url = "/api/test/reviews"
        response = self.client.post(url, data=body)

        # este comando parsea la JsonResponse a un diccionario para poder acceder a los valores
        data = json.loads(response.content)
        #print(data)

        # Se hacen las comprobaciones
        self.assertEqual(data['rating'],4)
        self.assertEqual(data['preference_0'],True)
        self.assertEqual(data['preference_1'],True)
        self.assertEqual(data['preference_2'],False)


#Test de ejemplo de un put
class PutTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create(username="TEST USER1", first_name="John", last_name="Smith", email="test1@test.es", password="My secret pw")
        self.passenger1 = Passenger.objects.create(user=self.user1, balance=0.0)


    def tearDown(self):
        self.passenger1.delete()
        self.user1.delete()

    def test_put_user(self):
        url = "/api/test/users/" + str(self.user1.pk)

        body = {
            "firstName" : "New Name",
            "lastName" : "New lastName"
        }
        response = self.client.put(url, data=body)

        # este comando parsea la JsonResponse a un diccionario para poder acceder a los valores
        data = json.loads(response.content)
        # print(data)
        # Se hacen las comprobaciones
        self.assertEqual(data['id'],self.user1.pk)
        self.assertEqual(data['first_name'],"New Name")
        self.assertEqual(data['last_name'],"New lastName")

class UploadDocsDriverTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create(username="TEST USER1", first_name="John", last_name="Smith", email="test1@test.es", password="My secret pw")
        self.passenger1 = Passenger.objects.create(user=self.user1, balance=0.0)
        self.driver1 = Driver.objects.create(passenger=self.passenger1)
        with open('bugalinkapp/test/dni_front.jpg', 'rb') as f:
            self.dni_front = f.read()
        
        with open('bugalinkapp/test/sworn_declaration.pdf', 'rb') as f:
            self.sworn_declaration = f.read()

    def tearDown(self):
        self.passenger1.delete()
        self.user1.delete()
        self.driver1.delete()

    def test_put_user(self):
        url = "/api/users/" + str(self.user1.pk) + "/driver/docs" 
        body = {
            "sworn_declaration" : self.sworn_declaration,
            "dni_front" : self.dni_front
        }
        response = self.client.put(url, data=body)

        data = json.loads(response.content)

        self.assertEqual(data['sworn_declaration'], self.driver1.sworn_declaration)
        self.assertEqual(data['dni_front'], self.driver1.dni_front)
  

# Ejemplo de delete
class DeleteTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create(username="TEST USER1", first_name="John", last_name="Smith", email="test1@test.es", password="My secret pw")
        self.passenger1 = Passenger.objects.create(user=self.user1, balance=0.0)


    def tearDown(self):
        self.passenger1.delete()
        self.user1.delete()

    def test_delete_user(self):
        url = "/api/test/users/" + str(self.user1.pk)
        response = self.client.delete(url)

        self.assertEqual(response.status_code,204)
        
        response2 = self.client.get(url)
        self.assertEqual(response2.status_code,404)

# users /<userId> -> Devuelve la información del usuario
class UserGetTest(TestCase):
    
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create(username="TEST USER", email="test@test.es")
        self.passenger1 = Passenger.objects.create(user=self.user1, balance=0.0)

    def tearDown(self):    
        self.passenger1.delete()
        self.user1.delete()
       

    def test_get_user_by_id(self):
        url = "/api/users/" + str(self.user1.pk)
        response = self.client.get(url)

        data = json.loads(response.content)

        self.assertEqual(data['user'],self.user1.pk)

# users /<userId>/rides/total -> Devuelve el número total de viajes que ha hecho el usuario con BugaLink
class TotalRidesGetTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create(username="TEST USER", email="test@test.es")
        self.passenger1 = Passenger.objects.create(user=self.user1, balance=0.0)
        self.driver1 = Driver.objects.create(passenger = self.passenger1, sworn_declaration = None, driver_license = None, dni_front = None, dni_back = None)

    def tearDown(self):    
        self.passenger1.delete()
        self.user1.delete()
        self.driver1.delete()
       
    def test_get_user_by_id(self):
        url = "/api/users/" + str(self.user1.pk) + "/rides/total" 
        response = self.client.get(url)
        data = json.loads(response.content)

        self.assertEqual(data['total_rides'],0)

class RatingsGetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create(username="TEST USER", email="test@test.es")
        self.passenger1 = Passenger.objects.create(user=self.user1, balance=0.0)
        self.driver1 = Driver.objects.create(passenger = self.passenger1, sworn_declaration = None, driver_license = None, dni_front = None, dni_back = None)
        
        self.user2 = User.objects.create(username="TEST USER 2", email="test2@test.es")
        self.passenger2 = Passenger.objects.create(user=self.user2, balance=0.0)
        self.driver2 = Driver.objects.create(passenger = self.passenger2, sworn_declaration = None, driver_license = None, dni_front = None, dni_back = None)
        
        self.driverRoutine1 = DriverRoutine.objects.create(driver = self.driver1, default_num_seats = 4, start_date_0 = '11:30:00', start_date_1 = '11:35:00', end_date = '12:30:00', start_location = "Mi casa", end_location = "Universidad", price = 2.0)
        self.ride1 = Ride.objects.create(driver_routine = self.driverRoutine1, num_seats = 4, start_date = datetime.strptime('2023-03-24 11:30:00', '%Y-%m-%d %H:%M:%S'), end_date = datetime.strptime('2023-03-24 12:30:00', '%Y-%m-%d %H:%M:%S'), start_location = "Mi casa", end_location = "Universidad")
        self.individualRide1 = IndividualRide.objects.create(ride = self.ride1, passenger = self.passenger2, passenger_routine = None, passenger_note = None, decline_note = None)
        self.ratingDriver = DriverRating.objects.create(individual_ride = self.individualRide1, rating = 5)
        
        self.driverRoutine2 = DriverRoutine.objects.create(driver = self.driver2, default_num_seats = 2, start_date_0 = '01:30:00', start_date_1 = '01:35:00', end_date = '02:30:00', start_location = "Mi casa", end_location = "Universidad", price = 2.0)
        self.ride2 = Ride.objects.create(driver_routine = self.driverRoutine2, num_seats = 4, start_date = datetime.strptime('2023-03-24 01:30:00', '%Y-%m-%d %H:%M:%S'), end_date = datetime.strptime('2023-03-24 02:30:00', '%Y-%m-%d %H:%M:%S'), start_location = "Mi trabajo", end_location = "Universidad")
        self.individualRide2 = IndividualRide.objects.create(ride = self.ride2, passenger = self.passenger1, passenger_routine = None, passenger_note = None, decline_note = None)
        self.ratingPassenger = PassengerRating.objects.create(individual_ride = self.individualRide2, rating = 1)
        
    def tearDown(self):    
        self.passenger1.delete()
        self.user1.delete()
        self.driver1.delete()
        self.driverRoutine1.delete()
        self.ride1.delete()
        self.individualRide1.delete()
        self.ratingDriver.delete() 

        self.passenger2.delete()
        self.user2.delete()
        self.driver2.delete()
        self.driverRoutine2.delete()
        self.ride2.delete()
        self.individualRide2.delete()
        self.ratingPassenger.delete()
        
    def test_get_user_by_id(self):
        url = "/api/users/" + str(self.user1.pk) + "/reviews/rating" 
        response = self.client.get(url)
        print("Respuesta : ")
        data = json.loads(response.content)

        self.assertEqual(data['total_ratings'],2)
        self.assertEqual(data['rating'],3)


#Test de ejemplo de un put
class PutRoutinesTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        self.user1 = User.objects.create(username="TEST USER1", first_name="John", last_name="Smith", email="test1@test.es", password="My secret pw")
        self.passenger1 = Passenger.objects.create(user=self.user1, balance=0.0)
        self.driver1=Driver.objects.create(passenger=self.passenger1)
        self.vehicle1 = Vehicle.objects.create(driver=self.driver1)
        self.driver_routine1 = DriverRoutine.objects.create(driver=self.driver1,default_vehicle=self.vehicle1,default_num_seats=2, start_date_0=time(12,00),start_date_1=time(12,30),end_date=time(13,00),start_location="Virgen de Lujan 120",end_location="Paseo de las Delicias S/N",day=Days.Mon,one_ride=True,price=2.0)
        self.passenger_routine1 = PassengerRoutine.objects.create(passenger=self.passenger1,start_time_initial=time(12,00),start_time_final=time(12,30),end_date=time(13,00),start_location="Virgen de Lujan 120",end_location="Paseo de las Delicias S/N",day=Days.Mon)
        self.passenger_routine2 = PassengerRoutine.objects.create(passenger=self.passenger1,
                                                                  start_time_initial=time(12,00),
                                                                  start_time_final=time(12,30),
                                                                  end_date=time(13,00),
                                                                  start_longitude = "-77.0680000000",
                                                                  start_latitude = "38.8951000000",
                                                                  end_longitude = "-76.6183000000",
                                                                  end_latitude = "39.2904000000",
                                                                  start_location="Virgen de Lujan 120",
                                                                  end_location="Paseo de las Delicias S/N",
                                                                  day=Days.Tue)
    def tearDown(self):
        self.user1.delete()
        self.passenger1.delete()
        self.driver1.delete()
        self.vehicle1.delete()
        self.driver_routine1.delete()
        self.passenger_routine1.delete()


    def test_put_driver_routine(self):
        url = "/api/users/driver-routines/" + str(self.driver_routine1.pk)

        body = {
            "default_vehicle_id":self.vehicle1.pk,
            "driver_id": self.driver1.pk,
            "default_num_seats": 1,
            "start_date_0": "9:00",
            "start_date_1": "9:10",
            "end_date": "9:30",
            "start_latitude":33.233,
            "start_longitude":33.3333,
            "end_latitude":32.83,
            "end_longitude":34.1,
            "start_location": "Av. de Italia, 41012 Sevilla",
            "end_location": "Escuela Técnica Superior de Arquitectura, Avenida de la Reina Mercedes, Sevilla",
            "day": "Mon",
            "one_ride": "False",
            "price": 3.22,
            "driver_note":"La puerta de detrás te la tengo que abrir yo desde dentro"
        }
        response = self.client.put(url, data=body)

        # este comando parsea la JsonResponse a un diccionario para poder acceder a los valores
        data = json.loads(response.content)
        # Se hacen las comprobaciones
        self.assertEqual(data['default_vehicle'],str(self.vehicle1.pk))
        self.assertEqual(data['driver'],str(self.driver1.pk))
        self.assertEqual(data['default_num_seats'],1)
        self.assertEqual(data['start_date_0'],"9:00")
        self.assertEqual(data['start_date_1'],"9:10")
        self.assertEqual(data['end_date'],"9:30")
        self.assertEqual(data['start_latitude'],'33.2330000000')
        self.assertEqual(data['start_longitude'],'33.3333000000')
        self.assertEqual(data['end_latitude'],'32.8300000000')
        self.assertEqual(data['end_longitude'],'34.1000000000')
        self.assertEqual(data['start_location'],"Av. de Italia, 41012 Sevilla")
        self.assertEqual(data['end_location'],"Escuela Técnica Superior de Arquitectura, Avenida de la Reina Mercedes, Sevilla")
        self.assertEqual(data['day'],"Mon")
        self.assertEqual(data['one_ride'],False)
        self.assertEqual(data['price'],'3.22')
        self.assertEqual(data['driver_note'],"La puerta de detrás te la tengo que abrir yo desde dentro")
    
    def test_put_passenger_routine(self):
        url = "/api/users/passenger-routines/" + str(self.passenger_routine1.pk)

        body = {
            "passenger_id": self.passenger1.pk,
            "start_latitude":33.32233,
            "start_longitude":33.333333333,
            "end_latitude":33.44,
            "end_longitude":33.22,
            "start_location": "Av. de Italia, 41012 Sevilla",
            "end_location": "Escuela Técnica Superior de Arquitectura, Avenida de la Reina Mercedes, Sevilla",
            "start_time_initial": "9:00",
            "start_time_final": "9:30",
            "end_date": "10:00",
            "day": "Mon"
        }
        response = self.client.put(url, data=body)

        # este comando parsea la JsonResponse a un diccionario para poder acceder a los valores
        data = json.loads(response.content)
        # Se hacen las comprobaciones
        self.assertEqual(data['start_time_initial'],"9:00")
        self.assertEqual(data['start_time_final'],"9:30")
        self.assertEqual(data['end_date'],"10:00")
        self.assertEqual(data['start_latitude'],'33.3223300000')
        self.assertEqual(data['start_longitude'],'33.3333333330')
        self.assertEqual(data['end_latitude'],'33.4400000000')
        self.assertEqual(data['end_longitude'],'33.2200000000')
        self.assertEqual(data['start_location'],"Av. de Italia, 41012 Sevilla")
        self.assertEqual(data['end_location'],"Escuela Técnica Superior de Arquitectura, Avenida de la Reina Mercedes, Sevilla")
        self.assertEqual(data['day'],"Mon")

    def test_get_passenger_routine(self):
        url = "/api/users/passenger-routines/" + str(self.passenger_routine2.pk)
        response = self.client.get(url)

        data = json.loads(response.content)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['end_location'],"Paseo de las Delicias S/N")

    def test_get_driver_routine(self):
        url = "/api/users/driver-routines/" + str(self.driver_routine1.pk)
        response = self.client.get(url)

        data = json.loads(response.content)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['end_location'],"Paseo de las Delicias S/N")


class RideSearchTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.client = APIClient()
        self.user1 = User.objects.create(username="TEST USER", email="test@test.es")
        self.passenger1 = Passenger.objects.create(user=self.user1, balance=0.0)
        self.passengerRoutine1 = PassengerRoutine.objects.create(passenger=self.passenger1, start_time_initial='8:01', start_time_final='8:15', end_date='9:00', start_latitude=10.0, end_latitude=11.0, start_longitude=10.0, end_longitude=11.0, day='Mon')

        self.user2 = User.objects.create(username="TEST USER 2", email="test2@test.es")
        self.passenger2 = Passenger.objects.create(user=self.user2, balance=0.0)
        self.driver2 = Driver.objects.create(passenger=self.passenger2)
        self.driverRoutine2 = DriverRoutine.objects.create(driver=self.driver2, default_num_seats=1, start_date_0='8:00', start_date_1='8:15', end_date='9:00', start_latitude=10.0, end_latitude=11.0, start_longitude=10.0, end_longitude=11.0,day='Mon', price=10.0)
        self.ride2 = Ride.objects.create(driver_routine=self.driverRoutine2, num_seats=1, start_date='2023-03-11 8:00', end_date='2023-03-11 8:15')

    def tearDown(self):
        self.ride2.delete()
        self.driverRoutine2.delete()
        self.driver2.delete()
        self.passenger2.delete()
        self.user2.delete()

        self.passengerRoutine1.delete()
        self.passenger1.delete()
        self.user1.delete()

    def test_get_ride_search(self):

        body = {
                "date": '2023-03-11 8:00',
                'lowPrice' : 0.0,
                'highPrice' : 11.00,
                'rating' : 0.00
                }

        url = "/api/ride/search"
        response = self.client.post(url, data=body)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data['rides'][0]['num_seats'], 1)

class AcceptPassengerIndividualRideTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create(username="TEST USER", email="test@test.es")
        self.passenger1 = Passenger.objects.create(user=self.user1, balance=0.0)
        self.passengerRoutine1 = PassengerRoutine.objects.create(passenger=self.passenger1, start_time_initial='8:01', start_time_final='8:15', end_date='9:00', start_latitude=10.0, end_latitude=11.0, start_longitude=10.0, end_longitude=11.0, day='Mon')


        self.user2 = User.objects.create(username="TEST USER 2", email="test2@test.es")
        self.passenger2 = Passenger.objects.create(user=self.user2, balance=0.0)
        self.driver2 = Driver.objects.create(passenger=self.passenger2)
        self.driverRoutine2 = DriverRoutine.objects.create(driver=self.driver2, default_num_seats=1, start_date_0='8:00', start_date_1='8:15', end_date='9:00', start_latitude=10.0, end_latitude=11.0, start_longitude=10.0, end_longitude=11.0,day='Mon', price=10.0)
        self.ride2 = Ride.objects.create(driver_routine=self.driverRoutine2, num_seats=1, start_date='2023-03-11 8:00', end_date='2023-03-11 8:15')

        self.individualRide1 = IndividualRide.objects.create(ride=self.ride2, passenger=self.passenger1, passenger_routine=self.passengerRoutine1)
        self.passengerRating1 = PassengerRating.objects.create(individual_ride=self.individualRide1, rating = 2.5)

        self.individualRide2 = IndividualRide.objects.create(ride=self.ride2, passenger=self.passenger2, passenger_routine=self.passengerRoutine1)
        self.driverRating1 = DriverRating.objects.create(individual_ride=self.individualRide2, rating = 2.5)

    def tearDown(self):
        self.driverRating1.delete()
        self.individualRide2.delete()
        self.passengerRating1.delete()
        self.individualRide1.delete()

        self.ride2.delete()
        self.driverRoutine2.delete()
        self.driver2.delete()
        self.passenger2.delete()
        self.user2.delete()

        self.passengerRoutine1.delete()
        self.passenger1.delete()
        self.user1.delete()

    def test_patch_accept_passenger_individual_ride(self):
        url = "/api/rides/individual/" + str(self.individualRide1.pk) + "/accept"
        response = self.client.patch(url)
        
        self.assertEqual(response.status_code, 200)

class IndividualRidesTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create(username="TEST USER", email="test@test.es")
        self.passenger1 = Passenger.objects.create(user=self.user1, balance=0.0)
        self.passengerRoutine1 = PassengerRoutine.objects.create(passenger=self.passenger1, start_time_initial='8:01', start_time_final='8:15', end_date='9:00', start_latitude=10.0, end_latitude=11.0, start_longitude=10.0, end_longitude=11.0, day='Mon')


        self.user2 = User.objects.create(username="TEST USER 2", email="test2@test.es")
        self.passenger2 = Passenger.objects.create(user=self.user2, balance=0.0)
        self.driver2 = Driver.objects.create(passenger=self.passenger2)
        self.driverRoutine2 = DriverRoutine.objects.create(driver=self.driver2, default_num_seats=1, start_date_0='8:00', start_date_1='8:15', end_date='9:00', start_latitude=10.0, end_latitude=11.0, start_longitude=10.0, end_longitude=11.0,day='Mon', price=10.0)
        self.ride2 = Ride.objects.create(driver_routine=self.driverRoutine2, num_seats=1, start_date='2023-03-11 8:00', end_date='2023-03-11 8:15')

        self.individualRide1 = IndividualRide.objects.create(ride=self.ride2, passenger=self.passenger1, passenger_routine=self.passengerRoutine1)
        self.passengerRating1 = PassengerRating.objects.create(individual_ride=self.individualRide1, rating = 2.5)

        self.individualRide2 = IndividualRide.objects.create(ride=self.ride2, passenger=self.passenger2, passenger_routine=self.passengerRoutine1)
        self.driverRating1 = DriverRating.objects.create(individual_ride=self.individualRide2, rating = 2.5)

    def tearDown(self):
        self.driverRating1.delete()
        self.individualRide2.delete()
        self.passengerRating1.delete()
        self.individualRide1.delete()

        self.ride2.delete()
        self.driverRoutine2.delete()
        self.driver2.delete()
        self.passenger2.delete()
        self.user2.delete()

        self.passengerRoutine1.delete()
        self.passenger1.delete()
        self.user1.delete()
    
    def test_get_individual_ride(self):
        url = "/api/rides/individual/" + str(self.individualRide1.pk)
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, 200)

class RideDetailTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        load_data(self)
    

    def test_get_ride_detail(self):
        url = "/api/rides/{}/detail".format(self.ride1.pk)
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(data['available_seats'],self.ride1.get_available_seats())
        self.assertEqual(data['recurrent'],not self.driver_routine1.one_ride)