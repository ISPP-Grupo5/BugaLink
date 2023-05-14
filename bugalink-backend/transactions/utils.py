import datetime
from decimal import Decimal
from payment_methods.models import Balance
from django.db.models import Q
from django.utils import timezone
from transactions.models import Transaction

def accept_transaction(transaction: Transaction): 
    receiver = transaction.receiver
    balance = Balance.objects.get(user=receiver)
    balance.amount += Decimal(transaction.amount)
    balance.save()
    transaction.status = "ACCEPTED"
    transaction.save()

    return transaction

def reject_transaction(transaction: Transaction):
    sender = transaction.sender
    balance = Balance.objects.get(user=sender)
    balance.amount += Decimal(transaction.amount)
    balance.save()
    transaction.status = "DECLINED"
    transaction.save()
    return transaction

def is_pilot_user_price(user, price: Decimal): 
    return price if user.is_pilotuser else price * Decimal(1.15)