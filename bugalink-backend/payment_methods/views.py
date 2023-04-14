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
    def webhook_view(request):
        payload = request.body

        # For now, you only need to print out the webhook payload so you can see
        # the structure.
        print(payload)

        return HttpResponse(status=200)
