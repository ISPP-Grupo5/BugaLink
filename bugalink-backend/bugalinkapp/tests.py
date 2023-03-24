from datetime import time, datetime
from django.test import TestCase
from django.contrib.auth.models import User
from .models import *
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.core.files.uploadedfile import SimpleUploadedFile
import json
import populate_db as populate


### IMPORTANTE ###
'''
Para que los tests ejecuten bien django crea una base de datos de prueba para tests, y luego la elimina. El problema es que
el usuario de postgres que hay especificado en config.env no tiene por defecto permisos para crear bases de datos, por lo que 
da error. Esto se soluciona entrando por consola a postgres "psql -U <user_admin>" 
Para mas info mirar semana 4 > guia configuración backend 

Una vez dentro, hay que hacer  `ALTER USER <nombre_usuario_de_config.env> CREATEDB;` y ya tendría permisos
'''


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
        self.user1 = User.objects.create(username="TEST USER1", email="test1@test.es")
        self.passenger1 = Passenger.objects.create(user=self.user1, balance=0.0)
        self.user2 = User.objects.create(username="TEST USER2", email="test2@test.es")
        self.passenger2 = Passenger.objects.create(user=self.user2, balance=0.0)
        self.driver1 = Driver.objects.create(passenger=self.passenger1)
        self.driver_routine1 = DriverRoutine.objects.create(driver=self.driver1,
                                                            default_num_seats=2,
                                                            start_date_0=time(12,00),
                                                            start_date_1=time(12,30),
                                                            end_date=time(13,00),
                                                            start_location="Virgen de Lujan 120",
                                                            end_location="Paseo de las Delicias S/N",
                                                            day=Days.Mon,
                                                            one_ride=True,
                                                            price=2.0)
        self.ride1 = Ride.objects.create(driver_routine=self.driver_routine1,
                                         num_seats=self.driver_routine1.default_num_seats,
                                          start_date = datetime(2020,4,7),
                                           end_date =datetime(2020,4,7),
                                           start_location = self.driver_routine1.start_location,
                                           end_location = self.driver_routine1.end_location
                                           )
        self.individual_ride1 = IndividualRide.objects.create(ride=self.ride1,
                                                              passenger=self.passenger2,
                                                              n_seats=1)

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


class RideDetailTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        User.objects.create(username="User1", password="My super secret pw")
        populate.execute()
    
    def tearDown(self):
        pass
    def test_get_ride_detail(self):
        pass
