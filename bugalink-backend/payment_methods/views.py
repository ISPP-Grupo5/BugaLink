from rest_framework import mixins, status, viewsets
from rest_framework.response import Response
from users.models import User

from .models import Balance
from .serializers import BalanceSerializer


class BalanceViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Balance.objects.all()
    serializer_class = BalanceSerializer

    # GET users/<int:user_id>/balance -> Se obtiene el balance del usuario.
    def get(self, request, *args, **kwargs):
        user_id = kwargs.get("user_id")
        if user_id:
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response(
                    {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
                )
            balance = Balance.objects.get(user=user)
            serializer = self.serializer_class(balance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "User ID not provided"}, status=status.HTTP_400_BAD_REQUEST
            )

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
