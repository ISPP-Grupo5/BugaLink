from django.db import models
from passengers.models import Passenger


class TransactionStatus(models.TextChoices):
    Accepted = 'Accepted'
    Declined = 'Declined'
    Pending = 'Pending'

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]
    
class Transaction(models.Model):
    sender = models.ForeignKey(Passenger, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(Passenger, on_delete=models.CASCADE, related_name='receiver')
    status = models.CharField(max_length=16, choices=TransactionStatus.choices, default=TransactionStatus.Pending)
    is_refund = models.BooleanField(default=False)
    amount = models.FloatField()
