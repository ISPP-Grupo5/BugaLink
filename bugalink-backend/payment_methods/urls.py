from django.urls import include, path
from rest_framework import routers

from payment_methods.views import BalanceViewSet

router = routers.DefaultRouter()
router.register(r"balance", BalanceViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path('users/<int:user_id>/balance', BalanceViewSet.as_view(), name='balance'),
ç
]

