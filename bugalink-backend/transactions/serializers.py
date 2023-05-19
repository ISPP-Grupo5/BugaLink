from rest_framework import serializers
from transactions.models import Transaction

from users.serializers import UserSerializer

class TransactionSerializer(serializers.ModelSerializer):
    sender = UserSerializer()
    receiver = UserSerializer()

    class Meta:
        model = Transaction
        fields = ("sender", "receiver", "status", "is_refund", "amount", "date")


