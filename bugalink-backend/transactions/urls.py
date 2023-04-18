from django.urls import include, path
from rest_framework import routers

from transactions.views import TransactionViewSet

router = routers.DefaultRouter()
router.register(r"transactions", TransactionViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path('users/<int:user_id>/transactions/recent/', TransactionViewSet.as_view({'get': 'list_recent_transactions'})),
    path('users/<int:user_id>/transactions/expected-expense/', TransactionViewSet.as_view({'get': 'get_expected_expense'}))
]
