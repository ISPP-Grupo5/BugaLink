from django.urls import include, path
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()
router.register(r'users/(?P<user_id>\d+)/reviews', RatingViewSet, basename='review')

urlpatterns = [
    # path('', include(router.urls)),
    path('users/<int:id>', users.as_view()),
    path('pendingindividualrides/', pendingIndividualRide.as_view()),
    path('cancelledindividualrides/', cancelledIndividualRide.as_view()),
    path('acceptedindividualrides/', acceptedIndividualRide.as_view()),
    path('routineFilter', routineRecommendation.as_view()),
    path('individualRides', individualRides.as_view()),
    path('rides/<int:pk>', Rides.as_view()),
    path('users/<int:pk>/passenger-routines', PassengerRoutineList.as_view()),
    path('users/<int:pk>/driver-routines', DriverRoutineList.as_view()),
    path('users/<int:user_id>/passenger-routines/<int:routine_id>', PassengerRoutineDelete.as_view()),
    path('users/<int:user_id>/driver-routines/<int:routine_id>', PassengerRoutineDelete.as_view())
]