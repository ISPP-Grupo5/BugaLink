from django.urls import include, path
from rest_framework import routers

from payment_methods.views import BalanceViewSet, PaymentViewSet

router = routers.DefaultRouter()
router.register(r"balance", BalanceViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path('users/<int:user_id>/balance/',
         BalanceViewSet.as_view({'get': 'get'}), name='balance'),
    path('trips/<int:trip_id>/checkout-balance/',
         PaymentViewSet.as_view({"post": "pay_with_balance"}, name='pay_with_balance')),
    path('trips/<int:trip_id>/create-checkout-session/',
         PaymentViewSet.as_view({"post": "create_checkout_session"}, name='create-checkout-session')),
    path('trips/<int:trip_id>/create-paypal-session/',
         PaymentViewSet.as_view({"post": "pay_with_paypal"}, name='create-paypal-session')),
    path("webhook/", PaymentViewSet.as_view({"post": "webhook_view"}, name='webhook')),
    path("webhook-paypal/",
         PaymentViewSet.as_view({"post": "webhook_paypal_view"}, name='webhook')),

]
