from django.urls import path
from . import views

urlpatterns = [
    # Sin tests
    path('users', views.Users.as_view()),
    path('pendingindividualrides', views.PendingIndividualRides.as_view()),
    path('cancelledindividualrides', views.CancelledIndividualRide.as_view()),
    path('acceptedindividualrides', views.AcceptedIndividualRide.as_view()),
    path('rides', views.Rides.as_view()),
    path('users/individualrides', views.UserIndividualRides.as_view()),
    path('reviews', views.RatingList.as_view()),
    path('reviews/pending', views.PendingRatings.as_view()), # Devuelve un listado de individualRides pendientes de valorar dado en el body un userId


    # Con tests, ordenados por el orden de los tests
    path('users/<int:user_id>/routineFilter', views.RoutineRecommendation.as_view()),
    path('users/<int:user_id>/reviews/rating', views.Ratings.as_view()),
    path('users/<int:user_id>/rides/individual/pending', views.PendingIndividualRidesAndRoutineRequests.as_view()),
    path('users/<int:user_id>/driver/docs', views.UploadDocsDriver.as_view()),
    path('users/<int:user_id>', views.Users.as_view()),
    path('users/<int:user_id>/rides/total', views.TotalRides.as_view()),
    path('ride/search', views.RideSearch.as_view()),
    path('register', views.Register.as_view()),
    path('rides/individual/<int:individual_ride_id>/accept', views.AcceptPassengerIndividualRide.as_view()),
    path('rides/individual/<int:individual_ride_id>', views.IndividualRides.as_view()),
    path('rides/<int:ride_id>/detail', views.RideDetail.as_view()),
    path('users/<int:user_id>/rides', views.UserRideList.as_view()),
    path('rides/<int:ride_id>/request', views.RideRequest.as_view()),
    path('rides/individual/<int:individualRideId>/decline', views.CancelPassengerIndividualRide.as_view()),

    # DriverRoutines
    path('users/<int:user_id>/driver-routines', views.DriverRoutineList.as_view()),
    path('users/<int:user_id>/driver-routine', views.DriverRoutine.as_view()), # Por revisar por estar duplicado
    path('users/driver-routines/<int:driver_routine_id>', views.DriverRoutine.as_view()),# Por revisar por estar duplicado

    # PassengerRoutines
    path('users/<int:user_id>/passenger-routines', views.PassengerRoutineList.as_view()),
    path('users/passenger-routines/<int:passenger_routine_id>', views.PassengerRoutine.as_view()), # Por revisar por estar duplicado
    path('users/<int:user_id>/passenger-routine', views.PassengerRoutine.as_view()), # Por revisar por estar duplicado
    
    # Endpoints de tests de prueba, solo deben existir 'test/users/<int:userId>' y 'test/reviews'
    path('test/users/<int:userId>', views.UsersTest.as_view()),
    path('test/reviews', views.RatingListTest.as_view()),
]
