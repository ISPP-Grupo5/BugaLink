import os
import django
import json
from operator import attrgetter

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BugaLink.settings')
django.setup()
modelos = json.load(open('populate_db.json', 'r', encoding='utf-8'))

from bugalinkapp.models import Passenger, Ride, Driver, DriverRating, PassengerRating, Vehicle, IndividualRide,PassengerRoutine, DriverRoutine, CreditCard, Paypal,DiscountCode,IndividualDiscountCode,PassengerDiscountCode,RoutineRequest,Report, Transaction
from django.contrib.auth.models import User

def execute():
    for key in modelos:
        print(key)
        for attrs in modelos[key]:
            if key in 'User':
                User.objects.create_user(**attrs)
            else:
                globals()[key].objects.create(**attrs)
    print("End populate")
if __name__ == "__main__":
    execute()
