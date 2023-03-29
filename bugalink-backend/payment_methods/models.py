from django.db import models

from users.models import User


class PaymentMethod(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="payment_methods"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Balance(PaymentMethod):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="balance")
    amount = models.DecimalField(max_digits=10, decimal_places=2)


class CreditCard(PaymentMethod):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="credit_cards"
    )
    number = models.CharField(max_length=16)
    name = models.CharField(max_length=255)
    expiration_date = models.DateField()
    is_default = models.BooleanField(default=False)


class PaypalAccount(PaymentMethod):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="paypal_accounts"
    )
    token = models.CharField(max_length=255)
    is_default = models.BooleanField(default=False)
