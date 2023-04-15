from trips.views import TripRequestViewSet
from django.http import HttpResponse
from bugalink_backend import settings
from rest_framework import mixins, status, viewsets
import os
from django.shortcuts import redirect
import paypalrestsdk
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
        note = request.data.get("note")
        trip = Trip.objects.get(id=kwargs["trip_id"])
        user = request.user
        # El post recibe la cantidad en centimos integer
        price = int(float(trip.driver_routine.price) * 100)
        URL = "http://127.0.0.1:3000"

        # No puedo añadir nuevos campos a line items, por lo que lo estoy pasando en el name del producto
        # data = 'Trip:' + str(trip.id) + ',User:' + str(user.id)
        if settings.APP_ENGINE:
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
            metadata={
                'user_id': user.id,
                'trip_id': trip.id,
                'note': note
            },
            mode='payment',
            success_url=URL,  # TODO crear pantalla de pagado
            cancel_url=URL + "/cancel",  # TODO pantalla de cancelado
        )

        return Response({'url': session.url})

    @csrf_exempt
    def webhook_view(self, request):
        endpoint_secret = settings.WEBHOOK_SECRET
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

        if event['type'] == 'checkout.session.completed':
            session = stripe.checkout.Session.retrieve(
                event['data']['object']['id'],
                expand=['line_items'],
            )

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
    
    ''' FUTURE IMPLEMENTATION def pay_with_paypal(self, request, *args, **kwargs):
    
        paypal_client_id = "AdWSL48duytv4qy76be71a2S3Tt5nTYn-1gGv-53vL_dxNWYzZpAGrUZYrZBvGjkNwOSxJE1s_RSCkL8"
        paypal_secret_key = "EHps0LO5OsQsUOrDTu9J6BY_mD0OkcF9aNzOT7rkRtDYKCOxoiqCUXsnz-nkhZX5rhlA741NosbaxBpb"

        # Set up PayPal API credentials
        paypalrestsdk.configure(
            {
                "mode": "sandbox",
                "client_id": paypal_client_id,
                "client_secret": paypal_secret_key,
            }
        )

        paypal_url = (
            "https://app.bugalink.es"
            if os.environ.get("IS_APP_ENGINE")
            else "http://localhost:3000"
        )

        # Create a payment object
        payment = paypalrestsdk.Payment(
            {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal",
                },
                "redirect_urls": {
                    "return_url": paypal_url,
                    "cancel_url": paypal_url,
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
                    return redirect(redirect_url)

        else:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "Failed to create PayPal payment"},
            )
    '''