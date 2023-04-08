import json
import os

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from drivers.models import Driver
from passengers.models import Passenger
from rest_framework import status
from rest_framework.test import APIClient
from users.models import User


class PreferencesTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            email="test@test.com",
            first_name="nameTest",
            last_name="lastNameTest",
            is_passenger=True,
            is_driver=True,
        )
        self.passenger = Passenger.objects.create(user=self.user)
        self.driver = Driver.objects.create(
            user=self.user,
            prefers_talk=False,
            prefers_music=False,
            allows_pets=False,
            allows_smoke=False,
        )

        self.user2 = User.objects.create(
            email="test2@test.com",
            first_name="nameTest",
            last_name="lastNameTest",
            is_passenger=True,
            is_driver=True,
        )
        self.passenger2 = Passenger.objects.create(user=self.user2)
        self.driver2 = Driver.objects.create(
            user=self.user2,
            prefers_talk=False,
            prefers_music=False,
            allows_pets=False,
            allows_smoke=False,
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_get_preferences(self):
        url = "/api/v1/drivers/" + str(self.driver.pk) + "/preferences/"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(data["prefers_talk"], self.driver.prefers_talk)
        self.assertEqual(data["prefers_music"], self.driver.prefers_music)
        self.assertEqual(data["allows_pets"], self.driver.allows_pets)
        self.assertEqual(data["allows_smoke"], self.driver.allows_smoke)

    def test_put_preferences(self):
        url = "/api/v1/drivers/" + str(self.driver.pk) + "/preferences/"
        body = {
            "prefers_talk": True,
            "prefers_music": False,
            "allows_pets": False,
            "allows_smoke": True,
        }
        response = self.client.put(url, data=body)
        data = json.loads(response.content)
        self.assertEqual(data["prefers_talk"], body["prefers_talk"])
        self.assertEqual(data["prefers_music"], body["prefers_music"])
        self.assertEqual(data["allows_pets"], body["allows_pets"])
        self.assertEqual(data["allows_smoke"], body["allows_smoke"])

    def test_invalid_put(self):
        url = "/api/v1/drivers/" + str(self.driver2.pk) + "/preferences/"
        body = {
            "prefers_talk": True,
            "prefers_music": False,
            "allows_pets": False,
            "allows_smoke": True,
        }
        response = self.client.put(url, data=body)
        data = json.loads(response.content)
        self.assertEqual(response.status_code, 403)
        self.assertIsNotNone(data.get("error"))


class DriverDocsTests(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            email="test@test.com",
            first_name="nameTest",
            last_name="lastNameTest",
            is_passenger=True,
            is_driver=True,
        )
        self.passenger = Passenger.objects.create(user=self.user)
        self.driver = Driver.objects.create(
            user=self.user,
            prefers_talk=False,
            prefers_music=False,
            allows_pets=False,
            allows_smoke=False,
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_upload_driver_docs(self):
        url = "/api/v1/drivers/docs/"

        dni_path = "drivers/dnis/"
        dni_front_content = open(dni_path + "dni_front.jpg", "rb").read()
        dni_back_content = open(dni_path + "dni_back.jpg", "rb").read()

        dni_front = SimpleUploadedFile(
            name="dni_front.jpg", content=dni_front_content, content_type="image/jpeg"
        )

        dni_back = SimpleUploadedFile(
            name="dni_back.jpg", content=dni_back_content, content_type="image/jpeg"
        )

        data = {
            "dni_front": dni_front,
            "dni_back": dni_back,
        }

        response = self.client.put(url, data=data)
        json_data = json.loads(response.content)

        # Check response status code
        self.assertEqual(
            response.status_code, 200
        )  # Update with the expected status code

        # Check if driver documents are correctly uploaded
        self.assertEqual(json_data.get("dni_front").split("/")[-1], "dni_front.jpg")
        self.assertEqual(json_data.get("dni_back").split("/")[-1], "dni_back.jpg")

        dni_front.close()
        dni_back.close()
        os.remove("files/drivers/dnis/dni_front.jpg")
        os.remove("files/drivers/dnis/dni_back.jpg")
