from django.test import TestCase
from django.contrib.auth.models import User
from .models import Passenger, Driver, Vehicle
from django.core.files.uploadedfile import SimpleUploadedFile

class Test(TestCase):
    def setUp(self):

        # CREATE USER 
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass'
        )
        
        self.photo = SimpleUploadedFile(
            name='test_photo.jpg',
            content=open("bugalinkapp/test/test_photo.jpg", 'rb').read(),
            content_type='image/jpeg'
        )

        # CREATE PASSENGER
        self.passenger = Passenger.objects.create(
            user=self.user,
            city='Test City',
            province='Test Province',
            biography='Test Biography',
            birth_date='1990-01-01',
            balance=100.00,
            photo=self.photo,
            verified=False
        )
        
        self.sworn_declaration = SimpleUploadedFile(
            name='sworn_declaration.pdf',
            content=open("bugalinkapp/test/sworn_declaration.pdf", 'rb').read(),
            content_type='application/pdf'
        )
        self.driver_license = SimpleUploadedFile(
            name='driver_license.jpg',
            content=open("bugalinkapp/test/driver_license.jpg", 'rb').read(),
            content_type='image/jpeg'
        )
        self.dni_front = SimpleUploadedFile(
            name='dni_front.jpg',
            content=open("bugalinkapp/test/dni_front.jpg", 'rb').read(),
            content_type='image/jpeg'
        )
        self.dni_back = SimpleUploadedFile(
            name='dni_front.jpg',
            content=open("bugalinkapp/test/dni_front.jpg", 'rb').read(),
            content_type='image/jpeg'
        )

        # CREATE DRIVER
        self.driver = Driver.objects.create(
            passenger=self.passenger,
            preferences='Test Preferences',
            biography='Test Biography',
            has_driver_license=True,
            has_sworn_declaration=True,
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

        self.insurance_file = SimpleUploadedFile(
            name='test_insurance.pdf',
            content=b'Test insurance file contents',
            content_type='application/pdf'
        )

        #VEHICLE
        self.vehicle = Vehicle.objects.create(
            driver = self.driver,
            model='Test Model',
            plate='Test Plate',
            has_insurance=True,
            insurance=self.insurance_file
        )

    # Esto permite borrar los archivos "subidos"
    def tearDown(self):         
        self.passenger.photo.delete()
        self.driver.dni_front.delete()
        self.driver.dni_back.delete()
        self.driver.driver_license.delete()
        self.driver.sworn_declaration.delete()
        self.vehicle.insurance.delete()
    
    ######### EMPIEZA EL TESTING ###################

    def test_passenger_creation(self):
        self.assertIsInstance(self.passenger, Passenger)
        self.assertEqual(self.passenger.city, 'Test City')
        self.assertEqual(self.passenger.province, 'Test Province')
        self.assertEqual(self.passenger.biography, 'Test Biography')
        self.assertEqual(str(self.passenger.birth_date), '1990-01-01')
        self.assertEqual(self.passenger.balance, 100.00)
        self.assertIsNotNone(self.passenger.photo)  # Ensure file is not None
        self.assertFalse(self.passenger.verified)

    def test_driver_creation(self):
        self.assertIsInstance(self.driver, Driver)
        self.assertEqual(self.driver.passenger, self.passenger)
        self.assertEqual(self.driver.preferences, 'Test Preferences')
        self.assertEqual(self.driver.biography, 'Test Biography')
        self.assertTrue(self.driver.has_driver_license)
        self.assertTrue(self.driver.has_sworn_declaration)
        self.assertEqual(str(self.driver.entry_date), '2022-03-11')
        self.assertEqual(self.driver.sworn_declaration.name, 'sworn_declaration.pdf')
        self.assertIsNotNone(self.driver.driver_license.name)
        self.assertIsNotNone(self.driver.dni_front)
    
    #def test_rating_creation(self):
    #    self.assertIsInstance(self.rating, Rating)
    #    self.assertEqual(self.rating.driver, self.rating.driver)
    #    self.assertEqual(self.rating.passenger, self.rating.passenger)
    #    self.assertAlmostEqual(self.rating.value, 4.5, places=2)
    #    self.assertEqual(self.rating.comment, 'Test Comment')

    def test_vehicle_creation(self):
        self.assertEqual(self.vehicle.model, 'Test Model')
        self.assertEqual(self.vehicle.plate, 'Test Plate')
        self.assertTrue(self.vehicle.has_insurance)
        self.assertEqual(self.vehicle.insurance.name, 'test_insurance.pdf')