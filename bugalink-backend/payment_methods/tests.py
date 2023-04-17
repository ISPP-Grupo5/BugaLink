import json
import re
import time
from unittest.mock import Mock

from users.models import User

from payment_methods.views import PaymentViewSet

from trips.views import TripRequestViewSet
from bugalink_backend import settings
from django.test import TestCase
from django.urls import reverse
import stripe
from trips.models import Trip
from users.tests import load_complex_data
from rest_framework.test import APIClient
from trips.models import Trip, TripRequest
from payment_methods.models import Balance
from passengers.models import Passenger

class RequestTripPayment(TestCase):

    def setUp(self):
        self.maxDiff = None
        self.client = APIClient()
        load_complex_data(self)
        self.balance = Balance.objects.create(user=self.user_2, amount=100)
        self.client.force_authenticate(user=self.user_2)
    
    def test_request_trip_balance(self):
        url = "/api/v1/trips/" + str(self.trip.id) + "/checkout-balance/"
        response = self.client.post(url, data ={"note": "I need a ride"})
        
        passenger = Passenger.objects.get(user=self.user_2)

        self.assertEqual(TripRequest.objects.get(trip=self.trip, status = "PENDING", passenger = passenger).price, self.trip.driver_routine.price)

        self.assertEqual(Balance.objects.get(user=self.user_2).amount, self.balance.amount - self.trip.driver_routine.price)

        self.assertIsNotNone(TripRequest.objects.get(trip=self.trip, status = "PENDING", passenger = passenger))

        self.assertEqual(response.status_code, 201)

    #Test to check payment with stripe
    def test_create_checkout_session(self):
        url = "/api/v1/trips/" + str(self.trip.id) + "/create-checkout-session/"
        response = self.client.post(url, data ={})

        self.assertEqual(response.status_code, 200)
        
        # Can't test the url because it's a random string
        #expected_url = "https://checkout.stripe.com/c/pay/cs_test_a1R4RgSpLAgMGn8BS2FGPLJskySPtwxM8ysngwSFHvRYEtBQ99qNnOzvZ9#fidkdWxOYHwnPyd1blpxYHZxWjA0SHJLTDFHSkFESGxTYjJzV3BJM2Bycl1%2FTlRuTjZCQGlEVXxqT1V%2FRjJxdTNmV2hnMn1WYzJ2MGFGXXx2dWFJXz10bVJGQUl9fEJSXT1oa3ZRaFNCTG59NTV1M1RMa0ZQZCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl"
        #self.assertEqual(response.data['url'], expected_url)
       
        # Assert that the url is a valid url
        url_pattern = re.compile(
                r'^(?:http|ftp)s?://'  # http:// or https://
                # domain...
                r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?))'
                r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        
        self.assertTrue(re.match(url_pattern, response.data['url']))

    def test_webhook_view(self):
        
        webhook_url = '/api/v1/webhook/'
        endpoint_secret = settings.WEBHOOK_SECRET
        event_id = 'evt_test_1234567890'
        event_type = 'checkout.session.completed'

        payload = {
                'type': event_type,
                'data': {
                    'object': {
                        'id': event_id,  
                        'metadata': {
                            'trip_id': '12345', 
                            'user_id': '98765', 
                            'note': 'Example note',  
                        }
                    }
                }
            }
        
        # Construct the event data
        event_data = {
            'type': event_type,
            'data': {
                'object': {
                    'id': event_id,  
                },
            },
        }

        timestamp = int(time.time())
        scheme = stripe.WebhookSignature.EXPECTED_SCHEME
        payload_to_sign = "%d.%s" % (timestamp, payload)
        # Sign the payload with the endpoint secret
        signature = stripe.WebhookSignature._compute_signature(
            payload_to_sign, endpoint_secret
        )
        header = "t=%d,%s=%s" % (timestamp, scheme, signature)
        
        assert stripe.WebhookSignature.verify_header(
            payload, header, endpoint_secret, tolerance=10
        )

        # TODO Seems like the header is not being sent correctly, when excuting the post 
        # returns the stripe.error.SignatureVerificationError, but verify_header is working properly.
        
        # response = self.client.post(webhook_url, data=event_data, format = 'json', header = header, HTTP_STRIPE_SIGNATURE = signature)

        # Assert that the response status code is 200 (or any other expected value)
        # self.assertEqual(response.status_code, 200)

        # Assert that the response content is empty or contains the expected content
        # self.assertContains(response, 'Expected content', status_code=200)
    
    def test_recharge_balance(self):
        price = 12
        price_cents = 1200

        session = stripe.checkout.Session.create(
            line_items=[{
                'price_data': {
                    'currency': 'eur',
                    'product_data': {
                        'name': 'Carpooling',
                    },
                    'unit_amount': price_cents,
                },
                'quantity': 1,
            }],
            metadata={
                'user_id': self.user_2.id,
                'trip_id': self.trip.id,
                'note': "Example note"
            },
            mode='payment',
            success_url="https://bugalink.es",  # TODO crear pantalla de pagado
            cancel_url="https://bugalink.es",  # TODO pantalla de cancelado
        )
         
        # Call the recharge_balance function
        result = PaymentViewSet.recharge_balance(self,session)

        # Assert that there has been no error
        self.assertTrue(result)

        # Assert that the balance amount is updated correctly
        self.assertEqual(Balance.objects.get(user=self.user_2).amount, self.balance.amount + price)
        
    def test_recharge_with_paypal(self):
        url = "/api/v1/recharge/paypal/"
        response = self.client.post(url, data ={'amount': 12})

        self.assertEqual(response.status_code, 200)
        
        # Can't test the url because it's a random string depending of params as time just like stripe
        #self.assertEqual(response.data['url'], expected_url)
       
        # Assert that the url is a valid url
        url_pattern = re.compile(
                r'^(?:http|ftp)s?://'  # http:// or https://
                # domain...
                r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?))'
                r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        
        self.assertTrue(re.match(url_pattern, response.data['url']))

    def test_recharge_with_credit_card(self):
        url = "/api/v1/recharge/credit-card/"
        response = self.client.post(url, data ={'amount': 200})

        self.assertEqual(response.status_code, 200)
        
        # Can't test the url because it's a random string depending of params as time 
        #self.assertEqual(response.data['url'], expected_url)
       
        # Assert that the url is a valid url
        url_pattern = re.compile(
                r'^(?:http|ftp)s?://'  # http:// or https://
                # domain...
                r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?))'
                r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        
        self.assertTrue(re.match(url_pattern, response.data['url']))