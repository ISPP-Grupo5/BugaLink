from django.urls import path
from . import views

urlpatterns = [
    path('users', views.Users.as_view()),
    path('pendingindividualrides', views.PendingIndividualRides.as_view()),
    path('cancelledindividualrides', views.CancelledIndividualRide.as_view()),
    path('acceptedindividualrides', views.AcceptedIndividualRide.as_view()),
    path('users/<int:user_id>/routineFilter', views.RoutineRecommendation.as_view()),
    path('ride/search', views.RideSearch.as_view()),
    path('rides/individual/<int:individualRideId>', views.IndividualRides.as_view()),
    path('rides/individual/<int:individualRideId>/accept', views.AcceptPassengerIndividualRide.as_view()),
    path('rides', views.Rides.as_view()),
    path('users/<int:user_id>', views.Users.as_view()),
    path('users/<int:user_id>/rides/total', views.TotalRides.as_view()),
    path('users/<int:user_id>/reviews/rating', views.Ratings.as_view()),
    path('users/individualrides', views.UserIndividualRides.as_view()),
    path('users/<int:user_id>/driver/docs', views.UploadDocsDriver.as_view()),
    #PASSENGER ROUTINES
    path('users/passenger-routines/<int:passenger_routine_id>', views.PassengerRoutine.as_view()),
    path('users/passenger-routines', views.PassengerRoutineList.as_view()),
    #DRIVER ROUTINES
    path('users/driver-routines/<int:driver_routine_id>', views.DriverRoutine.as_view()),
    path('users/driver-routines', views.DriverRoutineList.as_view()),
    path('users/passenger-routine', views.PassengerRoutine.as_view()),
    path('users/driver-routine', views.DriverRoutine.as_view()),
    path('users/<int:user_id>/rides/individual/pending', views.PendingIndividualRidesAndRoutineRequests.as_view()),
    path('reviews', views.RatingList.as_view()),
    path('users/<int:user_id>/reviews/rating', views.Rating.as_view()),
    path('reviews/pending', views.PendingRatings.as_view()), # Devuelve un listado de individualRides pendientes de valorar dado en el body un userId
    path('rides/<int:ride_id>/detail',views.RideDetail.as_view()),
    
    #Endpoints de tests de prueba
    path('test/users/<int:userId>', views.UsersTest.as_view()),
    path('test/users/<int:user_id>/rideRecommendation', views.RoutineRecommendation.as_view()),
    path('test/users/<int:user_id>/reviews/rating', views.Rating.as_view()),
    path('test/reviews', views.RatingListTest.as_view())
]
