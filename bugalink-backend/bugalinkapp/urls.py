from django.urls import path
from . import views

urlpatterns = [
   
    path('users/<int:id>', views.Users.as_view()),
    path('pendingindividualrides/', views.PendingIndividualRide.as_view()),
    path('cancelledindividualrides/', views.CancelledIndividualRide.as_view()),
    path('acceptedindividualrides/', views.AcceptedIndividualRide.as_view()),
    path('routineFilter', views.RoutineRecommendation.as_view()),
    path('individualRides', views.IndividualRides.as_view()),
    path('rides/<int:pk>', views.Rides.as_view()),
    path('users/<int:pk>/passenger-routines', views.PassengerRoutineList.as_view()),
    path('users/<int:pk>/driver-routines', views.DriverRoutineList.as_view()),
    path('users/<int:user_id>/passenger-routines/<int:routine_id>', views.PassengerRoutine.as_view()),
    path('users/<int:user_id>/driver-routines/<int:routine_id>', views.DriverRoutine.as_view()),
    path('reviews', views.RatingList.as_view()),
    path('reviews/rating', views.Rating.as_view()),
    path('reviews/pending', views.PendingRatings.as_view()) #Devuelve un listado de individualRides pendientes de valorar dado en el body un userId
]
