from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Transaction, User
from .serializers import TransactionSerializer

class TransactionViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.sender = User.objects.create(email="test@test.com", first_name="Sender", last_name="lastNameTest", is_passenger = True, is_driver=True)
        self.receiver = User.objects.create(email="test_receiver@test.com", first_name="Receiver", last_name="lastNameTest", is_passenger = True, is_driver=True)
        self.client.force_authenticate(user=self.sender)
        self.client.force_authenticate(user=self.receiver)

        self.transaction1 = Transaction.objects.create(
            sender=self.sender,
            receiver=self.receiver,
            status="ACCEPTED",
            is_refund=False,
            amount=100.0
        )
        self.transaction2 = Transaction.objects.create(
            sender=self.sender,
            receiver=self.receiver,
            status="ACCEPTED",
            is_refund=False,
            amount=200.0
        )
        self.transaction3 = Transaction.objects.create(
            sender=self.sender,
            receiver=self.receiver,
            status="ACCEPTED",
            is_refund=False,
            amount=50.0
        )

    def test_get_last_transactions(self):
        url = "/api/v1/users/" + str(self.sender.pk) + "/transactions/get_last_transactions/"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        serializer_data = TransactionSerializer([self.transaction2, self.transaction1, self.transaction3], many=True).data
        self.assertEqual(response.data, serializer_data)


