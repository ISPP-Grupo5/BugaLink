from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q

from transactions.models import Transaction
from users.models import User
from transactions.serializers import TransactionSerializer

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
    
    @action(detail=False, methods=['get'])
    def get_last_transactions(self, request, *args, **kwargs):
        user_id = kwargs["user_id"]
        print(user_id)
        user = User.objects.get(id=user_id)

        transactions = Transaction.objects.filter(Q(sender=user) | Q(receiver=user))[:10]

        serializer = self.serializer_class(transactions, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
