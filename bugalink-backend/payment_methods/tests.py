from django.test import TestCase
import stripe
from trips.models import Trip
from users.tests import load_complex_data
from rest_framework.test import APIClient

class CheckoutSessionTest(TestCase):

    def setUp(self):
        self.maxDiff = None
        self.client = APIClient()
        load_complex_data(self)
        self.client.force_authenticate(user=self.user_2)

    def test_create_checkout_session(self):
        url = "/api/v1/trips/" + str(self.trip.id) + "/create-checkout-session/"
        response = self.client.post(url, data ={})

        self.assertEqual(response.status_code, 200)
        
        # Can't test the url because it's a random string
        #expected_url = "https://checkout.stripe.com/c/pay/cs_test_a1R4RgSpLAgMGn8BS2FGPLJskySPtwxM8ysngwSFHvRYEtBQ99qNnOzvZ9#fidkdWxOYHwnPyd1blpxYHZxWjA0SHJLTDFHSkFESGxTYjJzV3BJM2Bycl1%2FTlRuTjZCQGlEVXxqT1V%2FRjJxdTNmV2hnMn1WYzJ2MGFGXXx2dWFJXz10bVJGQUl9fEJSXT1oa3ZRaFNCTG59NTV1M1RMa0ZQZCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl"
        #self.assertEqual(response.data['url'], expected_url)
        #self.assertRedirects ? 
