from django.urls import include, path
from rest_framework import routers

from payment_methods.views import BalanceViewSet, PaymentViewSet

router = routers.DefaultRouter()
router.register(r"balance", BalanceViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path('users/<int:user_id>/balance/',
         BalanceViewSet.as_view({'get': 'get'}), name='balance'),
    path('trips/<int:pk>/create-checkout-session/',
         PaymentViewSet.as_view({"create_checkout_session": "post"}, name='create-checkout-session'))

]
