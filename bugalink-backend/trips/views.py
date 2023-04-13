from bugalink_backend import settings
import paypal
import stripe
from django.db.models import Q
from passenger_routines.models import PassengerRoutine
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
    def create(self, request, *args, **kwargs):
        def pay_with_balance(balance, price):
            if balance.amount < price:
                return Response(
                    status=status.HTTP_400_BAD_REQUEST,
                    data={"error": "Saldo insuficiente"},
                )
            balance.amount -= price
            balance.save()

        def pay_with_credit_card(price):
            stripe.api_key = settings.STRIP

            # Get the amount to charge (in cents)
            amount = int(price * 100)

            try:
                stripe.Charge.create(
                    amount=amount,
                    currency="eur",
                    source=request.data.get(
                        "stripe_token"
                    ),  # TODO replace with a valid card token
                    description="Viaje Bugalink - " + str(trip.departure_datetime),
                )

            except stripe.error.CardError:
                return Response(
                    status=status.HTTP_400_BAD_REQUEST,
                    data={"error": "Tarjeta inválida"},
                )

        def pay_with_paypal(price):
            paypal_client_id = "your_paypal_client_id"  # TODO change it
            paypal_secret_key = "your_paypal_secret_key"  # TODO change it

            environment = paypal.Environment(
                client_id=paypal_client_id, client_secret=paypal_secret_key
            )
            client = paypal.PayPalHttpClient(environment)

            # Get the amount to charge
            amount = price

            # Create a PayPal order
            order = paypal.OrderRequest(
                {
                    "intent": "CAPTURE",
                    "purchase_units": [
                        {"amount": {"currency_code": "EUR", "value": str(amount)}}
                    ],
                }
            )
            response = client.execute(paypal.OrdersCreateRequest(order))
            order_id = response.result.id

            # Capture the payment
            capture = paypal.CaptureRequest(order_id)
            client.execute(capture)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        trip = Trip.objects.get(id=kwargs["trip_id"])
        """ FUTURE IMPLEMENTATION
        user = request.user
        payment_method = request.data.get("payment_method")
        price = trip.driver_routine.price


        if payment_method == "Balance":
            balance = Balance.objects.get(user=user)
            pay_with_balance(balance, price)

        elif payment_method == "CreditCard":
            pay_with_credit_card(price)

        elif payment_method == "PayPal":
            pay_with_paypal(price)

        else:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "Método de pago inválido"},
            )
        """
        serializer.save()

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


class TripRateViewSet(
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = TripRequest.objects.all()
    serializer_class = TripRequestSerializer

    @action(detail=True, methods=["post"])
    def post(self, request, trip_id, *args, **kwargs):
        try:
            trip = Trip.objects.get(id=trip_id)
            if trip.status == "FINISHED":
                trip_request = TripRequest.objects.filter(
                    trip=trip, status="ACCEPTED", passenger__user=request.user
                ).first()
            if trip_request:
                rating = request.POST.get("rating")
                is_good_driver = request.POST.get("is_good_driver")
                is_pleasant_driver = request.POST.get("is_pleasant_driver")
                already_knew = request.POST.get("already_knew")

                DriverRating.objects.create(
                    trip_request=TripRequest.objects.get(id=trip_request.id),
                    rating=rating,
                    is_good_driver=is_good_driver,
                    is_pleasant_driver=is_pleasant_driver,
                    already_knew=already_knew,
                )

                return Response({"message": "Valoración realizada con exito"})
            else:
                return Response({"message": "No has participado en este viaje"})
        except Exception as e:
            return Response({"message": str(e)})
