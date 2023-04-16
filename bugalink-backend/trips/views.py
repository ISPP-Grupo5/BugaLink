import os

import paypalrestsdk
import stripe
from bugalink_backend import settings
from django.db import transaction
from django.db.models import Q
from django.shortcuts import redirect
from passenger_routines.models import PassengerRoutine
from payment_methods.models import Balance
from ratings.models import DriverRating, Report
from ratings.serializers import DriverRatingSerializer
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from transactions.models import Transaction
from trips.models import Trip, TripRequest
from trips.serializers import (
    TripReportSerializer,
    TripRequestCreateSerializer,
    TripRequestSerializer,
    TripSerializer,
    TripUsersSerializer,
)
from users.models import User
from users.serializers import UserSerializer

from .serializers import TripRateSerializer
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

        def pay_with_credit_card(
            price, credit_car_number, expiration_month, expiration_year, cvc
        ):
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
                    confirm=True,
                )

                # Check if the payment is succeeded
                if payment_intent.status == "succeeded":
                    print("Payment succeeded!")
                else:
                    return Response(
                        status=status.HTTP_400_BAD_REQUEST,
                        data={"error": "Método de pago fallido"},
                    )

            except stripe.error.StripeError:
                return Response(
                    status=status.HTTP_400_BAD_REQUEST,
                    data={"error": "Stripe error"},
                )

        def pay_with_paypal(price):
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

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        trip = Trip.objects.get(id=kwargs["trip_id"])

        user = request.user
        payment_method = request.data.get("payment_method")
        price = trip.driver_routine.price

        if payment_method == "Balance":
            balance = Balance.objects.get(user=user)
            paid = pay_with_balance(balance, price)

            if not paid:
                return Response(
                    {"error": "Saldo insuficiente"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        elif payment_method == "CreditCard":
            credit_car_number = request.data.get("credit_car_number")
            expiration_month = request.data.get("expiration_month")
            expiration_year = request.data.get("expiration_year")
            cvc = request.data.get("cvc")
            pay_with_credit_card(
                price, credit_car_number, expiration_month, expiration_year, cvc
            )

        elif payment_method == "PayPal":
            pay_with_paypal(price)

        else:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "Método de pago inválido"},
            )

        serializer.save()

        Transaction.objects.create(
            sender=user,
            receiver=trip.driver_routine.driver.user,
            amount=price,
        )

        created_id = serializer.instance.id
        headers = self.get_success_headers(serializer.data)

        return Response(
            {"id": created_id, **serializer.data},
            # self.get_serializer(driver_routine).data,
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

    # GET /trip-requests/pending/count/ (For a driver to get the number of pending requests)
    def count(self, request, *args, **kwargs):
        num_pending_requests = TripRequest.objects.filter(
            trip__driver_routine__driver__user=request.user,
            trip__status="PENDING",
            status="PENDING",
        )
        return Response({"count": num_pending_requests.count()})

    # PUT /trip-requests/<pk>/accept/ (For a driver to accept a trip request)

    @action(detail=True, methods=["put"])
    def accept(self, request, *args, **kwargs):
        trip_request = TripRequest.objects.get(id=kwargs["pk"])
        trip_request.status = "ACCEPTED"
        trip_request.save()
        return Response(self.get_serializer(trip_request).data)

    # PUT /trip-requests/<pk>/reject/ (For a driver to reject a trip request)
    @action(detail=True, methods=["put"])
    def reject(self, request, *args, **kwargs):
        trip_request = TripRequest.objects.get(id=kwargs["pk"])
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


class TripRateViewSet(
    viewsets.GenericViewSet,
):
    queryset = TripRequest.objects.all()
    serializer_class = TripRateSerializer

    @action(detail=True, methods=["post"])
    def post(self, request, trip_id, *args, **kwargs):
        serializer = TripRateSerializer(data=request.data)

        trip = Trip.objects.get(id=trip_id)
        trip_request = None
        if trip.status != "FINISHED":
            return Response(
                {"message": "No se puede valorar un viaje que no ha terminado"},
                status=status.HTTP_403_FORBIDDEN,
            )
        trip_request = TripRequest.objects.filter(
            trip=trip, status="ACCEPTED", passenger__user=request.user
        ).first()
        driver_rating = DriverRating.objects.filter(trip_request=trip_request)
        if len(driver_rating) > 0:
            return Response(
                {"message": "Ya ha valorado este viaje"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if trip_request:
            driver_rating = serializer.create(trip_request)
            response_serializer = DriverRatingSerializer(driver_rating)
            print(response_serializer.data)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "No has participado en este viaje "})

        # try:
        #     trip = Trip.objects.get(id=trip_id)
        #     if trip.status == "FINISHED":
        #         trip_request = TripRequest.objects.filter(
        #             trip=trip, status="ACCEPTED", passenger__user=request.user
        #         ).first()
        #     if trip_request:
        #         rating = request.POST.get("rating")
        #         is_good_driver = request.POST.get("is_good_driver")
        #         is_pleasant_driver = request.POST.get("is_pleasant_driver")
        #         already_knew = request.POST.get("already_knew")

        #         DriverRating.objects.create(
        #             trip_request=TripRequest.objects.get(id=trip_request.id),
        #             rating=rating,
        #             is_good_driver=is_good_driver,
        #             is_pleasant_driver=is_pleasant_driver,
        #             already_knew=already_knew,
        #         )

        #         return Response({"message": "Valoración realizada con exito"})
        #     else:
        #         return Response({"message": "No has participado en este viaje"})
        # except Exception as e:
        #     return Response({"message": str(e)})


class ReportIssuePostViewSet(
    viewsets.GenericViewSet,
):
    queryset = Trip.objects.all()
    serializer_class = TripReportSerializer

    @action(detail=True, methods=["post"])
    def post(self, request, trip_id, *args, **kwargs):
        trip = Trip.objects.get(id=trip_id, status="FINISHED")
        user = request.user
        trip_request = TripRequest.objects.filter(
            trip=trip, passenger__user=user
        ).first()
        # Trip request solo existe si el user es un passenger, de forma que aqui se comprueba si es passenger o driver del viaje, si no lo es
        # no puede reportar
        if trip_request or trip.driver_routine.driver.user == user:
            reported_user_id = request.POST.get("reported_user_id")
            reported_user = User.objects.get(id=reported_user_id)
            reporter_is_driver = user == trip.driver_routine.driver.user
            reported_is_driver = reported_user == trip.driver_routine.driver.user

            note = request.POST.get("note")
            Report.objects.create(
                trip=trip,
                reporter_user=user,
                reported_user=reported_user,
                reporter_is_driver=reporter_is_driver,
                reported_is_driver=reported_is_driver,
                note=note,
            )
            return Response(
                {"message": "Report creado con exito"}, status=status.HTTP_201_CREATED
            )


class ReportIssueGetViewSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin):
    queryset = Trip.objects.all()
    serializer_class = TripUsersSerializer

    @action(detail=True, methods=["get"])
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
