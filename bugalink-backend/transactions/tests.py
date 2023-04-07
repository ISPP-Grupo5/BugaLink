from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Transaction, User
from .serializers import TransactionSerializer

class TransactionViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('get_last_transactions', kwargs={'user_id': 1})

        self.sender = User.objects.create(email="test@test.com", first_name="Semder", last_name="lastNameTest", is_passenger = True, is_driver=True)
        self.receiver = User.objects.create(email="test@test.com", first_name="Receiver", last_name="lastNameTest", is_passenger = True, is_driver=True)

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
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        serializer_data = TransactionSerializer([self.transaction2, self.transaction1, self.transaction3], many=True).data
        self.assertEqual(response.data, serializer_data)


