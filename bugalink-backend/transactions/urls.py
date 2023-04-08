from django.urls import include, path
from rest_framework import routers

from transactions.views import TransactionViewSet

router = routers.DefaultRouter()
router.register(r"transactions", TransactionViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path('users/<int:user_id>/transactions/get_last_transactions/', TransactionViewSet.as_view({'get': 'get_last_transactions'}), name='get_last_transactions')
]
