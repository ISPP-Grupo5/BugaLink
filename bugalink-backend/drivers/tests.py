from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from users.models import User
from rest_framework.authtoken.models import Token

class DriverDocsTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create(email='testuser@bugalink.es', password='testpass')        
        self.token = Token.objects.create(user=self.user)        
        self.headers = {"Authorization": f"Token {self.token.key}"}
    
    #Not working
    def test_upload_driver_docs(self):
        url = reverse("driver-post-docs", kwargs={"user_id": self.user.id})
        data = {
            "sworn_declaration": "https://example.com/sworn_declaration.pdf",
            "driver_license": "https://example.com/driver_license.pdf",
            "dni_front": "https://example.com/dni_front.pdf",
            "dni_back": "https://example.com/dni_back.pdf"
        }
        response = self.client.put(url, data, format="json", headers=self.headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
