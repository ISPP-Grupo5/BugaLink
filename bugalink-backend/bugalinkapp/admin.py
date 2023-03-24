from django.contrib import admin
from .models import Passenger, Ride, Driver, DriverRating, PassengerRating, Vehicle, IndividualRide,PassengerRoutine, DriverRoutine, CreditCard, Paypal,DiscountCode,IndividualDiscountCode,PassengerDiscountCode,RoutineRequest,Report, Transaction

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
admin.site.register(DiscountCode)
admin.site.register(IndividualDiscountCode)
admin.site.register(PassengerDiscountCode)
admin.site.register(RoutineRequest)
admin.site.register(Report)
admin.site.register(Transaction)

