from django.db import models
from users.models import User


class Transaction(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
    receiver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="receiver", null=True
    )
    status = models.CharField(
        max_length=16,
        choices=(
            ("PENDING", "PENDING"),
            ("ACCEPTED", "ACCEPTED"),
            ("DECLINED", "DECLINED"),
            ("RECHARGE", "RECHARGE")
        ),
        default="PENDING",
    )
    is_refund = models.BooleanField(default=False)
    amount = models.FloatField()
    date = models.DateField(auto_now=True)

    @property
    def is_bank_withdraw(self):
        return self.receiver is None
