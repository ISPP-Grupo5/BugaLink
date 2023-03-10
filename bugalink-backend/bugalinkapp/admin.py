from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Passenger)
admin.site.register(Ride)
admin.site.register(Driver)
admin.site.register(DriverRating)
admin.site.register(PassengerRating)
admin.site.register(Vehicle)
admin.site.register(IndividualRide)
admin.site.register(PassengerRoutine)
admin.site.register(DriverRoutine)
admin.site.register(CreditCard)
admin.site.register(Paypal)
admin.site.register(FavDirection)
admin.site.register(DiscountCode)
admin.site.register(IndividualDiscountCode)
admin.site.register(PassengerDiscountCode)

