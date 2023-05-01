from django.urls import include, path
from payment_methods.views import BalanceViewSet, PaymentViewSet, RechargeViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r"balance", BalanceViewSet)

urlpatterns = [
    path(
        "users/<int:user_id>/balance/",
        BalanceViewSet.as_view({"get": "get"}),
        name="balance",
    ),
    # Pay a trip
    path(
        "trips/<int:trip_id>/checkout-balance/",
        PaymentViewSet.as_view({"post": "pay_with_balance"}, name="pay_with_balance"),
    ),
    path(
        "trips/<int:trip_id>/create-checkout-session/",
        PaymentViewSet.as_view(
            {"post": "create_checkout_session"}, name="create-checkout-session"
        ),
    ),
    path(
        "trips/<int:trip_id>/create-paypal-session/",
        PaymentViewSet.as_view(
            {"post": "pay_with_paypal"}, name="create-paypal-session"
        ),
    ),
    # Webhooks
    path("webhook/", PaymentViewSet.as_view({"post": "webhook_view"}, name="webhook")),
    path(
        "webhook-paypal/",
        PaymentViewSet.as_view({"post": "webhook_paypal_view"}, name="webhook-paypal"),
    ),
    # Recharge
    path(
        "recharge/credit-card/",
        RechargeViewSet.as_view(
            {"post": "recharge_with_credit_card"}, name="recharge-with-credit-card"
        ),
    ),
    path(
        "recharge/paypal/",
        RechargeViewSet.as_view(
            {"post": "recharge_with_paypal"}, name="recharge-with-paypal"
        ),
    ),
    # Withdraw
    path(
        "balance/withdraw/",
        BalanceViewSet.as_view({"post": "withdraw"}),
        name="withdraw",
    ),
    path("", include(router.urls)),
]
