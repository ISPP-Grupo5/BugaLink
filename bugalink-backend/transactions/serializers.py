from rest_framework import serializers
from transactions.models import Transaction

from passengers.serializers import PassengerSerializer

class TransactionSerializer(serializers.ModelSerializer):
    sender = PassengerSerializer()
    receiver = PassengerSerializer()

    class Meta:
        model = Transaction
        fields = ("sender", "receiver", "status", "is_refund", "amount")


