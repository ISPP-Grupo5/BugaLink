import decimal
from datetime import datetime

import paypalrestsdk
import stripe
import transactions.utils as TransactionUtils
from bugalink_backend import settings
from django.db import transaction
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import mixins, status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.serializers import ValidationError
from transactions.models import Transaction
from trips.models import Trip, TripRequest
from trips.serializers import TripRequestSerializer
from trips.views import TripRequestViewSet
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
                raise ValidationError("Usuario inexistente")
            balance = Balance.objects.get(user=user)
            serializer = self.serializer_class(balance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            raise ValidationError("Usuario inexistente")

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def withdraw(self, request, *args, **kwargs):
        user = request.user
        # Check if the user has enough balance
        balance = Balance.objects.get(user=user)
        iban = request.data.get("iban")
        requested_withdraw_amount = float(request.data.get("amount").replace(",", "."))
        current_balance_cents = int(balance.amount * 100)
        # Cents are used here because comparisons between float and decimal fail sometimes
        # if the float has 2 decimals. Maybe it has to do something with floating point precision
        # and arithmetics. https://docs.python.org/3/tutorial/floatingpoint.html
        if current_balance_cents < int(requested_withdraw_amount * 100):
            raise ValidationError(
                "No tienes suficientes fondos en tu cuenta para realizar esta operación."
            )

        # Check that the balance the user wants to withdraw is greater than 0
        if requested_withdraw_amount <= 0:
            raise ValidationError("La cantidad a retirar debe ser mayor a 0€")

        # Check that the balance the user wants to withdraw is less than 1000
        if requested_withdraw_amount > 1000:
            raise ValidationError("La cantidad a retirar debe ser inferior a 1000€")

        if iban is None:
            raise ValidationError("El IBAN es obligatorio")

        balance.amount = float(balance.amount) - requested_withdraw_amount
        balance.save()

        Transaction.objects.create(
            sender=user,
            receiver=None,  # The receiver isn't any user, it's the bank
            amount=requested_withdraw_amount,
            date=datetime.now(),
            status="ACCEPTED",
        )

        return Response(
            {"message": "Your withdraw request has been accepted."},
            status=status.HTTP_202_ACCEPTED,
        )


class PaymentViewSet(
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = TripRequest.objects.all()
    serializer_class = TripRequestSerializer
    # Maybe it only have to permit in webhook CHECK THIS
    permission_classes = [AllowAny]
    # POST /trips/<id>/create-checkout-session/ (For a passenger to request a trip)
    # DOCS:
    # https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=checkout#redirect-customers

    def create_checkout_session(self, request, *args, **kwargs):
        stripe.api_key = settings.STRIPE_SECRET_KEY
        note = request.data.get("note")
        trip = Trip.objects.get(id=kwargs["trip_id"])
        user = request.user
        # El post recibe la cantidad en centimos integer
        price = int(
            TransactionUtils.is_pilot_user_price(user, trip.driver_routine.price) * 100
        )

        # Si no hay texto da error al intentar acceder a este dato
        note = note if note else "None"
        url_success = (
            f"https://app.bugalink.es/trips/{kwargs['trip_id']}/pay/success"
            if settings.APP_ENGINE
            else f"http://127.0.0.1:3000/trips/{kwargs['trip_id']}/pay/success"
        )
        url_fail = (
            f"https://app.bugalink.es/trips/{kwargs['trip_id']}/pay/fail"
            if settings.APP_ENGINE
            else f"http://127.0.0.1:3000/trips/{kwargs['trip_id']}/pay/fail"
        )

        session = stripe.checkout.Session.create(
            line_items=[
                {
                    "price_data": {
                        "currency": "eur",
                        "product_data": {
                            "name": "Carpooling",
                        },
                        "unit_amount": price,
                    },
                    "quantity": 1,
                }
            ],
            metadata={"user_id": user.id, "trip_id": trip.id, "note": note},
            mode="payment",
            success_url=url_success,
            cancel_url=url_fail,
        )

        return Response({"url": session.url})

    # POST /trips/<id>/checkout-balance/ (For a passenger to request a trip)

    @transaction.atomic
    def pay_with_balance(self, request, *args, **kwargs):
        trip = Trip.objects.get(id=kwargs["trip_id"])

        user = request.user
        price = TransactionUtils.is_pilot_user_price(user, trip.driver_routine.price)
        note = request.data.get("note")

        balance = Balance.objects.get(user=user)
        if balance.amount < price:
            raise ValidationError("Saldo insuficiente")

        # Si todo está correcto, se crea el triprequest y se resta el saldo
        no_errors = TripRequestViewSet.create(self, trip.id, user.id, price, note)
        if no_errors:
            balance.amount -= price
            balance.save()
            # Si todo está correcto, se crea el triprequest
            return Response(
                {"message": "Pago realizado con éxito"},
                status=status.HTTP_201_CREATED,
            )
        else:
            raise ValidationError(
                "Ha habido un error al realizar el pago. Intétalo de nuevo más tarde."
            )

    @transaction.atomic
    def pay_with_paypal(self, request, *args, **kwargs):
        note = request.data.get("note")
        trip = Trip.objects.get(id=kwargs["trip_id"])
        # El post recibe la cantidad en centimos integer
        price = TransactionUtils.is_pilot_user_price(
            request.user, trip.driver_routine.price
        )

        url_success = (
            f"https://app.bugalink.es/trips/{kwargs['trip_id']}/pay/success"
            if settings.APP_ENGINE
            else f"http://127.0.0.1:3000/trips/{kwargs['trip_id']}/pay/success"
        )
        url_fail = (
            f"https://app.bugalink.es/trips/{kwargs['trip_id']}/pay/fail"
            if settings.APP_ENGINE
            else f"http://127.0.0.1:3000/trips/{kwargs['trip_id']}/pay/fail"
        )

        # Si no hay texto da error al intentar acceder a este dato
        note = note if note else "None"

        paypal_client_id = settings.PAYPAL_CLIENT_ID
        paypal_secret_key = settings.PAYPAL_SECRET_KEY

        # Set up PayPal API credentials
        paypalrestsdk.configure(
            {
                "mode": "sandbox",
                "client_id": paypal_client_id,
                "client_secret": paypal_secret_key,
            }
        )

        # Create a payment object
        payment = paypalrestsdk.Payment(
            {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal",
                },
                "redirect_urls": {
                    "return_url": url_success,
                    "cancel_url": url_fail,
                },
                "transactions": [
                    {
                        "amount": {
                            "total": str(price),
                            "currency": "EUR",
                        },
                        "description": "Payment for your trip with Bugalink",
                    }
                ],
            }
        )

        # Create payment
        if payment.create():
            # Redirect the user to PayPal for payment approval
            for link in payment.links:
                if link.method == "REDIRECT":
                    redirect_url = link.href
                    return Response({"url": redirect_url})

        else:
            raise ValidationError(
                "Ha habido un error realizando el pago. Inténtalo con otro método de pago."
            )

    def recharge_balance(self, session):
        try:
            user = User.objects.get(id=session.metadata.user_id)
            balance = Balance.objects.get(user=user)
            amount = decimal.Decimal(int(session.amount_total)) / 100
            balance.amount += amount
            balance.save()
            Transaction.objects.create(
                sender=user,
                receiver=user,  # The receiver isn't any user, it's the bank
                amount=amount,
                date=datetime.now(),
                status="RECHARGE",
            )
            return True
        except Exception:
            return False

    @csrf_exempt
    def webhook_view(self, request):
        endpoint_secret = settings.WEBHOOK_SECRET
        payload = request.body
        sig_header = request.META["HTTP_STRIPE_SIGNATURE"]
        event = None

        try:
            event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
        except ValueError:
            # Invalid payload
            return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError:
            # Invalid signature
            return HttpResponse(status=status.HTTP_400_BAD_REQUEST)

        if event["type"] == "checkout.session.completed":
            session = stripe.checkout.Session.retrieve(
                event["data"]["object"]["id"],
                expand=["line_items"],
            )
            if session.line_items.data[0].description == "Carpooling":  # Pagar un viaje
                note = (
                    session.metadata.note if session.metadata.note != "None" else None
                )
                return TripRequestViewSet.create(
                    self, session.metadata.trip_id, session.metadata.user_id, note
                )
            elif session.line_items.data[0].description == "Recharge":  # Recargar saldo
                recharge_with_sucess = PaymentViewSet.recharge_balance(self, session)
                if recharge_with_sucess:
                    return HttpResponse(status=200)
                else:
                    return HttpResponse(status=status.HTTP_400_BAD_REQUEST)

        # ... handle other event types
        else:
            print("Unhandled event type {}".format(event["type"]))

        return HttpResponse(status=200)

    # TODO Paypal tiene los webhooks caidos por lo que esto no recibe nada, solo recibo con un simulator que me proporcionan
    @csrf_exempt
    def webhook_paypal_view(self, request):
        if "HTTP_PAYPAL_TRANSMISSION_ID" not in request.META:
            # Do not even attempt to process/store the event if there is
            # no paypal transmission id so we avoid overfilling the db.
            return HttpResponse(status=status.HTTP_400_BAD_REQUEST)

        payload = request.body

        if payload["event_type"] == "checkout.session.completed":
            # No puedo testear esto bien con eventos reales TODO
            print(payload)

        return HttpResponse(status=200)


class RechargeViewSet(
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Balance.objects.all()
    serializer_class = BalanceSerializer

    # POST /recharge/paypal/
    @transaction.atomic
    def recharge_with_paypal(self, request, *args, **kwargs):
        amount = request.data.get("amount").replace(",", ".")
        url_success = (
            "https://app.bugalink.es/wallet/success"
            if settings.APP_ENGINE
            else "http://127.0.0.1:3000/wallet/success"
        )
        url_fail = (
            "https://app.bugalink.es/wallet/fail"
            if settings.APP_ENGINE
            else "http://127.0.0.1:3000/wallet/fail"
        )

        paypal_client_id = settings.PAYPAL_CLIENT_ID
        paypal_secret_key = settings.PAYPAL_SECRET_KEY

        # Set up PayPal API credentials
        paypalrestsdk.configure(
            {
                "mode": "sandbox",
                "client_id": paypal_client_id,
                "client_secret": paypal_secret_key,
            }
        )

        # Create a payment object
        payment = paypalrestsdk.Payment(
            {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal",
                },
                "redirect_urls": {"return_url": url_success, "cancel_url": url_fail},
                "transactions": [
                    {
                        "amount": {
                            "total": str(amount),
                            "currency": "EUR",
                        },
                        "description": "Payment for your trip with Bugalink",
                    }
                ],
            }
        )
        # Create payment
        if payment.create():
            # Redirect the user to PayPal for payment approval
            for link in payment.links:
                if link.method == "REDIRECT":
                    redirect_url = link.href
                    return Response({"url": redirect_url})

        else:
            raise ValidationError(
                "Ha habido un error realizando la recarga. Inténtalo con otro método de pago"
            )

    # POST /recharge/credit-card/
    @transaction.atomic
    def recharge_with_credit_card(self, request, *args, **kwargs):
        stripe.api_key = settings.STRIPE_SECRET_KEY
        user = request.user

        # El post recibe la cantidad en centimos integer
        amount = int(float(request.data.get("amount").replace(",", ".")) * 100)

        # Si no hay texto da error al intentar acceder a este dato
        url_success = (
            "https://app.bugalink.es/wallet/success"
            if settings.APP_ENGINE
            else "http://127.0.0.1:3000/wallet/success"
        )
        url_fail = (
            "https://app.bugalink.es/wallet/fail"
            if settings.APP_ENGINE
            else "http://127.0.0.1:3000/wallet/fail"
        )

        session = stripe.checkout.Session.create(
            line_items=[
                {
                    "price_data": {
                        "currency": "eur",
                        "product_data": {
                            "name": "Recharge",
                        },
                        "unit_amount": amount,
                    },
                    "quantity": 1,
                }
            ],
            metadata={
                "user_id": user.id,
            },
            mode="payment",
            success_url=url_success,
            cancel_url=url_fail,
        )

        return Response({"url": session.url})
