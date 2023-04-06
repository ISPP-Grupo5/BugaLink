from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from passengers.models import Passenger
from payment_methods.models import Balance
import stripe
import paypal 

from trips.models import Trip, TripRequest
from trips.serializers import (
    TripRequestCreateSerializer,
    TripRequestSerializer,
    TripSerializer,
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


class TripRequestViewSet(
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

    # POST /trips/<id>/request/ (For a passenger to request a trip)
    def create(self, request, *args, **kwargs):
        def pay_with_balance(balance,price):
            if balance.amount < price:
                return Response(
                    status=status.HTTP_400_BAD_REQUEST,
                    data={"error": "Saldo insuficiente"},
                )
            balance.amount -= price
            balance.save()

        def pay_with_credit_card(price):
            stripe.api_key = "your_stripe_api_key"  # TODO change it 

            # Get the amount to charge (in cents)
            amount = int(price * 100)

            try:
                stripe.Charge.create(
                    amount=amount,
                    currency="eur",
                    source= request.data.get("stripe_token"),  #TODO replace with a valid card token
                    description= "Viaje Bugalink - " + str(trip.departure_datetime),
                )
                
            except stripe.error.CardError:
                return Response(
                    status=status.HTTP_400_BAD_REQUEST,
                    data={"error": "Tarjeta inválida"},
                )
        
        def pay_with_paypal(price):

            paypal_client_id = "your_paypal_client_id" # TODO change it
            paypal_secret_key = "your_paypal_secret_key" # TODO change it
            
            environment = paypal.Environment(
                client_id=paypal_client_id,
                client_secret=paypal_secret_key
            )
            client = paypal.PayPalHttpClient(environment)

            # Get the amount to charge
            amount = price

            # Create a PayPal order
            order = paypal.OrderRequest({
                "intent": "CAPTURE",
                "purchase_units": [
                    {
                        "amount": {
                            "currency_code": "EUR",
                            "value": str(amount)
                        }
                    }
                ]
            })
            response = client.execute(paypal.OrdersCreateRequest(order))
            order_id = response.result.id

            # Capture the payment
            capture = paypal.CaptureRequest(order_id)
            client.execute(capture)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        trip = Trip.objects.get(id=kwargs["trip_id"])
        payment_method = request.data.get("payment_method")
        price = trip.driver_routine.price

        ''' FUTURE IMPLEMENTATION
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
        '''
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
    
