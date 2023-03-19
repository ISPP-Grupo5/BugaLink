from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'users/(?P<user_id>\d+)/reviews', views.RatingViewSet, basename='review')

urlpatterns = [
    # path('', include(router.urls)),
    path('users/<int:id>', views.Users.as_view()),
    path('pendingindividualrides/', views.pendingIndividualRide.as_view()),
    path('cancelledindividualrides/', views.cancelledIndividualRide.as_view()),
    path('acceptedindividualrides/', views.acceptedIndividualRide.as_view()),
    path('routineFilter', views.RoutineRecommendation.as_view()),
    path('individualRides', views.IndividualRides.as_view()),
    path('rides/<int:pk>', views.Rides.as_view()),
    path('users/<int:pk>/passenger-routines', views.PassengerRoutineList.as_view()),
    path('users/<int:pk>/driver-routines', views.DriverRoutineList.as_view()),
    path('users/<int:user_id>/passenger-routines/<int:routine_id>', views.PassengerRoutineDelete.as_view()),
    path('users/<int:user_id>/driver-routines/<int:routine_id>', views.PassengerRoutineDelete.as_view())
]