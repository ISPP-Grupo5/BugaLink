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
        #self.assertRedirects ? 

    def test_webhook_view(self):
        
        webhook_url = 'api/v1/webhook/'
        endpoint_secret = settings.WEBHOOK_SECRET
        event_id = 'evt_test_1234567890'
        event_type = 'checkout.session.completed'

        payload = {
                'type': event_type,
                'data': {
                    'object': {
                        'id': event_id,  
                        'metadata': {
                            'trip_id': '12345',  # Replace with a valid trip ID
                            'user_id': '98765',  # Replace with a valid user ID
                            'note': 'Example note',  # Replace with an example note
                        }
                    }
                }
            }

        # Construct the event data
        event_data = {
            'type': event_type,
            'data': {
                'object': {
                    'id': 'event_id',  # Replace with a valid event ID
                },
            },
        }

        # Sign the payload with the endpoint secret
        signature = stripe.WebhookSignature._compute_signature(
            str(payload), endpoint_secret
        )

        # Add the signature to the request headers
        headers = {
            'HTTP_STRIPE_SIGNATURE': signature,
        }
        
        # Send a POST request to the webhook view with the payload and headers
        response = self.client.post(webhook_url, data=event_data, headers=headers)

        # Assert that the response status code is 200 (or any other expected value)
        self.assertEqual(response.status_code, 200)

        # Assert that the response content is empty or contains the expected content
        self.assertContains(response, 'Expected content', status_code=200)
    
    ''' FUTURE IMPLEMENTATION 
    def test_request_trip_paypal(self):
        
        url = "/api/v1/trips/" + str(self.trip.id) + "/request/"
        response = self.client.post(url, data ={"payment_method": "PayPal", 
                                                "note": "I need a ride"})
        
        self.assertEqual(response.status_code, 201)
        '''