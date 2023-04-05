from django.test import TestCase
from rest_framework.test import APIClient
import json
from .models import User
from passengers.models import Passenger
from drivers.models import Driver

class PreferencesTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(email="test@test.com", first_name="nameTest", last_name="lastNameTest", is_passenger = True, is_driver=True)
        self.passenger = Passenger.objects.create(user=self.user)
        self.driver = Driver.objects.create(user=self.user, prefers_talk = False, prefers_music = False, allows_pets = False, allows_smoke = False, )
        
        self.user2 = User.objects.create(email="test2@test.com", first_name="nameTest", last_name="lastNameTest", is_passenger = True, is_driver=True)
        self.passenger2 = Passenger.objects.create(user=self.user2)
        self.driver2 = Driver.objects.create(user=self.user2, prefers_talk = False, prefers_music = False, allows_pets = False, allows_smoke = False, )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_get_preferences(self):
        
        url = "/api/v1/drivers/"+ str(self.user.pk) + "/preferences/"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(data['prefers_talk'],self.driver.prefers_talk)
        self.assertEqual(data['prefers_music'],self.driver.prefers_music)
        self.assertEqual(data['allows_pets'],self.driver.allows_pets)
        self.assertEqual(data['allows_smoke'],self.driver.allows_smoke)

    def test_put_preferences(self):
        url = "/api/v1/drivers/"+ str(self.user.pk) + "/preferences/"
        body={
            "prefers_talk": True,
            "prefers_music": False,
            "allows_pets": False,
            "allows_smoke": True
            }
        response = self.client.put(url, data=body)
        data = json.loads(response.content)
        self.assertEqual(data['prefers_talk'],body['prefers_talk'])
        self.assertEqual(data['prefers_music'],body['prefers_music'])
        self.assertEqual(data['allows_pets'],body['allows_pets'])
        self.assertEqual(data['allows_smoke'],body['allows_smoke'])

    def test_invalid_put(self):
        url = "/api/v1/drivers/"+ str(self.user2.pk) + "/preferences/"
        body={
            "prefers_talk": True,
            "prefers_music": False,
            "allows_pets": False,
            "allows_smoke": True
            }
        response = self.client.put(url, data=body)
        data = json.loads(response.content)
        self.assertEqual(response.status_code, 403)
        self.assertIsNotNone(data.get('error'))
