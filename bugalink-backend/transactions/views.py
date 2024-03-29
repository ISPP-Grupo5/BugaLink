import datetime

from django.db.models import Q
from django.utils import timezone
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from transactions.models import Transaction
from transactions.serializers import TransactionSerializer
from users.models import User


class TransactionViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    @action(detail=False, methods=["get"])
    def list_recent_transactions(self, request, *args, **kwargs):
        user_id = kwargs["user_id"]
        user = User.objects.get(id=user_id)

        transactions = Transaction.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).order_by("-date")

        serializer = self.serializer_class(transactions, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def get_expected_expense(self, request, *args, **kwargs):
        user_id = kwargs["user_id"]
        user = User.objects.get(id=user_id)

        start_date = timezone.now().date() - datetime.timedelta(
            days=timezone.now().weekday()
        )
        end_date = start_date + datetime.timedelta(days=6)

        transactions = Transaction.objects.filter(
            ~Q(receiver=None),  # Don't include bank withdrawals
            Q(sender=user) & (Q(status="PENDING") | Q(status="ACCEPTED")),
            date__range=[start_date, end_date],
        )

        balance = 0.0
        for transaction in transactions:
            if transaction.sender == user:
                balance += transaction.amount

        return Response(balance, status=status.HTTP_200_OK)
