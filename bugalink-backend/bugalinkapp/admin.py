from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Passenger)
admin.site.register(Lift)
admin.site.register(Driver)
admin.site.register(Rating)
admin.site.register(Vehicle)
admin.site.register(IndividualLift)
admin.site.register(TravellerRoutine)
admin.site.register(DriverRoutine)
admin.site.register(CreditCard)
admin.site.register(Paypal)
admin.site.register(FavDirection)
admin.site.register(DiscountCode)
admin.site.register(IndividualDiscountCode)
admin.site.register(TravellerDiscountCode)

