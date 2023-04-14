import os
from django.shortcuts import redirect
from payment_methods.models import Balance
from bugalink_backend import settings
import paypalrestsdk
from paypalrestsdk import Payment
import stripe
from django.db.models import Q
from passenger_routines.models import PassengerRoutine
from transactions.models import Transaction
from ratings.models import DriverRating
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from trips.models import Trip, TripRequest
from trips.serializers import (
    TripRequestCreateSerializer,
    TripRequestSerializer,
    TripSerializer,
)
from django.db import transaction

from .utils import (
    check_allows_pets,
    check_allows_smoking,
    check_date_from,
    check_date_to,
    check_days,
    check_distance,
    check_hour_from,
    check_hour_to,
    check_maxprice,
    check_minprice,
    check_minstars,
    check_prefers_music,
    check_prefers_talk,
    get_recommendations,
)


class TripViewSet(
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        # TODO: untested!!
        # If the one deleting the trip is not the driver who created it, return 403
        if request.user != self.get_object().driver_routine.driver.user:
            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={
                    "error": "Un viaje sólo puede ser eliminado por el conductor que lo publicó"
                },
            )

        return self.destroy(request, *args, **kwargs)

    @action(detail=False, methods=["get"])
    def list_recommendations(self, request, *args, **kwargs):
        user = request.user
        recommendations = []
        for passenger_routine in PassengerRoutine.objects.filter(
            passenger__user_id=user.id
        ):
            recommendations += get_recommendations(obj=passenger_routine).data
        return Response(recommendations)


class TripRequestViewSet(
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = TripRequest.objects.all()
    serializer_class = TripRequestSerializer

    def get_serializer_class(self):
        if self.action == "create":
            return (
                TripRequestCreateSerializer  # TODO: use different serializer for GET?
            )
        return super().get_serializer_class()

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    # POST /trips/<id>/request/ (For a passenger to request a trip)
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        def pay_with_balance(balance, price):
            if balance.amount < price:
                return False  # No se ha pagado
            balance.amount -= price
            balance.save()
            return True  # Se ha pagado

        def pay_with_credit_card(price, credit_car_number, expiration_month, expiration_year, cvc):
            stripe.api_key = settings.STRIPE_SECRET_KEY

            amount = int(price * 100)  # Stripe expects amount in cents

            try:
                # Create a PaymentMethod
                payment_method = stripe.PaymentMethod.create(
                    type="card",
                    card={
                        "number": credit_car_number,
                        "exp_month": expiration_month,
                        "exp_year": expiration_year,
                        "cvc": cvc,
                    },
                )

                # Confirm the PaymentMethod to complete the payment
                payment_intent = stripe.PaymentIntent.create(
                    payment_method=payment_method.id,
                    amount=amount,
                    currency="eur",
                    confirmation_method="manual",
                    confirm=True
                )

                # Check if the payment is succeeded
                if payment_intent.status == "succeeded":
                    print("Payment succeeded!")
                else:
                    return Response(
                        status=status.HTTP_400_BAD_REQUEST,
                        data={"error": "Método de pago fallido"},
                    )

            except stripe.error.StripeError as e:
                return Response(
                    status=status.HTTP_400_BAD_REQUEST,
                    data={"error": "Stripe error"},
                )

        def pay_with_paypal(price):
            paypal_client_id = "AdWSL48duytv4qy76be71a2S3Tt5nTYn-1gGv-53vL_dxNWYzZpAGrUZYrZBvGjkNwOSxJE1s_RSCkL8"
            paypal_secret_key = "EHps0LO5OsQsUOrDTu9J6BY_mD0OkcF9aNzOT7rkRtDYKCOxoiqCUXsnz-nkhZX5rhlA741NosbaxBpb"

            # Set up PayPal API credentials
            paypalrestsdk.configure({
                "mode": "sandbox",
                "client_id": paypal_client_id,
                "client_secret": paypal_secret_key,
            })

            if os.environ.get("IS_APP_ENGINE"):
                # Create a payment object
                payment = Payment({
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal",
                    },
                    "redirect_urls": {
                        "return_url": "https://app.bugalink.es",
                        "cancel_url": "https://app.bugalink.es",
                    },
                    "transactions": [{
                        "amount": {
                            "total": str(price),
                            "currency": "EUR",
                        },
                        "description": "Payment for your trip with Bugalink",
                    }],
                })
            else:
                # Create a payment object
                payment = Payment({
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal",
                    },
                    "redirect_urls": {
                        "return_url": "http://127.0.0.1:3000",
                        "cancel_url": "http://127.0.0.1:3000",
                    },
                    "transactions": [{
                        "amount": {
                            "total": str(price),
                            "currency": "EUR",
                        },
                        "description": "Payment for your trip with Bugalink",
                    }],
                })

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

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        trip = Trip.objects.get(id=kwargs["trip_id"])

        user = request.user
        payment_method = request.data.get("payment_method")
        price = trip.driver_routine.price

        if payment_method == "Balance":
            balance = Balance.objects.get(user=user)
            payed = pay_with_balance(balance, price)

            if (not payed):
                return Response(
                    {"error": "Saldo insuficiente"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        elif payment_method == "CreditCard":
            credit_car_number = request.data.get("credit_car_number")
            expiration_month = request.data.get("expiration_month")
            expiration_year = request.data.get("expiration_year")
            cvc = request.data.get("cvc")
            pay_with_credit_card(price, credit_car_number,
                                 expiration_month, expiration_year, cvc)

        elif payment_method == "PayPal":
            pay_with_paypal(price)

        else:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "Método de pago inválido"},
            )

        serializer.save()

        Transaction.objects.create(sender=user, receiver=trip.driver_routine.driver.user,
                                   amount=price, is_refund=False, status="PENDING")

        created_id = serializer.instance.id
        headers = self.get_success_headers(serializer.data)

        return Response(
            {"id": created_id, **serializer.data},
            # self.get_serializer(driver_routine).data,
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

    # PUT /trip-requests/<pk>/accept/ (For a driver to accept a trip request)
    @action(detail=True, methods=["put"])
    def accept(self, request, *args, **kwargs):
        trip_request = self.get_object()
        trip_request.status = "ACCEPTED"
        trip_request.save()
        return Response(self.get_serializer(trip_request).data)

    # PUT /trip-requests/<pk>/reject/ (For a driver to reject a trip request)
    @action(detail=True, methods=["put"])
    def reject(self, request, *args, **kwargs):
        trip_request = self.get_object()
        trip_request.status = "REJECTED"
        trip_request.save()
        return Response(self.get_serializer(trip_request).data)


class TripSearchViewSet(
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

    @action(detail=True, methods=["get"])
    def get(self, request, *args, **kwargs):
        # Se busca entre los viajes pendientes
        trips = Trip.objects.filter(status="PENDING")
        # Comprobacion de campos obligatorios
        if not request.GET.get("origin") or not request.GET.get("destination"):
            return Response(
                {"message": "El origen y el destino son obligatorios"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        filter_checks = {
            "days": check_days,
            "min_price": check_minprice,
            "max_price": check_maxprice,
            "date_from": check_date_from,
            "date_to": check_date_to,
            "hour_from": check_hour_from,
            "hour_to": check_hour_to,
            "prefers_music": check_prefers_music,
            "prefers_talk": check_prefers_talk,
            "allows_pets": check_allows_pets,
            "allows_smoking": check_allows_smoking,
        }

        # Apply all filters on the QuerySet
        for key, func in filter_checks.items():
            if request.GET.get(key):
                trips = func(trips, request.GET.get(key))

        # Comprobacion de distancia
        trips = check_distance(
            trips, request.GET.get("origin"), request.GET.get("destination")
        )

        # Comprobacion de minStars
        if request.GET.get("min_stars"):
            trips = check_minstars(trips, request.GET.get("min_stars"))

        trips = Trip.objects.filter(Q(pk__in=[trip.pk for trip in trips])).order_by(
            "-departure_datetime"
        )[:10]

        return Response(
            TripSerializer(trips, many=True).data, status=status.HTTP_200_OK
        )
