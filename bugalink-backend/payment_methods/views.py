from trips.views import TripRequestViewSet
from django.http import HttpResponse
from bugalink_backend import settings
from rest_framework import mixins, status, viewsets
import os
from django.shortcuts import redirect

import stripe
from trips.serializers import TripRequestSerializer
from trips.models import TripRequest, Trip
from rest_framework.response import Response
from users.models import User

from .models import Balance
from .serializers import BalanceSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny


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
        trip = Trip.objects.get(id=kwargs["trip_id"])
        # El post recibe la cantidad en centimos integer
        price = int(float(trip.driver_routine.price) * 100)

        URL = "http://127.0.0.1:3000"

        if os.environ.get("IS_APP_ENGINE"):
            URL = "https://app.bugalink.es"

        session = stripe.checkout.Session.create(
            line_items=[{
                'price_data': {
                    'currency': 'eur',
                    'product_data': {
                        'name': 'Carpooling',
                    },
                    'unit_amount': price,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=URL,  # TODO crear pantalla de pagado
            cancel_url=URL + "/cancel",  # TODO pantalla de cancelado
        )

        return Response({'url': session.url})

    @csrf_exempt
    def webhook_view(self, request):
        endpoint_secret = os.environ.get("WEBHOOK_SECRET")
        payload = request.body
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']
        event = None

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except ValueError as e:
            # Invalid payload
            return HttpResponse(status=400)
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            return HttpResponse(status=400)

            # Handle the event
        if event['type'] == 'payment_intent.canceled':
            # payment_intent = event['data']['object']
            # TODO Pago cancelado
            pass
        elif event['type'] == 'payment_intent.payment_failed':
            # payment_intent = event['data']['object']
            # TODO Pago fallado
            pass
        elif event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            print(payment_intent)
        # ... handle other event types
        else:
            print('Unhandled event type {}'.format(event['type']))

        return HttpResponse(status=200)


    # POST /trips/<id>/checkout-balance/ (For a passenger to request a trip)
    def pay_with_balance(self, request, *args, **kwargs):
        trip = Trip.objects.get(id=kwargs["trip_id"])

        user = request.user
        price = trip.driver_routine.price
        note = request.data.get("note")

        balance = Balance.objects.get(user=user)
        if balance.amount < price:
            return Response(
                {"error": "Saldo insuficiente"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            balance.amount -= price
            balance.save()
            return TripRequestViewSet.create(self, trip.id, user.id, note)   # Si todo está correcto, se crea el triprequest
            