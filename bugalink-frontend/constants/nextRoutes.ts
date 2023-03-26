const NEXT_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: (userId) => `/users/${userId}`,
  EDIT_PROFILE: (userId) => `/users/${userId}/edit`,
  MY_ROUTINES: (userId) => `/users/${userId}/routines`,
  RIDE_HISTORY: (userId) => `/users/${userId}/history`,
  RIDE_DETAILS_ONE: (rideId) => `/ride/${rideId}/detailsOne`,
  RIDE_DETAILS_TWO: (rideId) => `/ride/${rideId}/detailsTwo`,
  RIDE_MAP: (rideId) => `/ride/${rideId}/map`,
  RATING_RIDE: (userId) => `/users/${userId}/rating/new`,
  NEW_ROUTINE_DRIVER: (userId) => `/users/${userId}/routines/driver/new`,
  NEW_ROUTINE_PASSENGER: (userId) => `/users/${userId}/routines/passenger/new`,
  ACCEPT_RIDE: (rideId) => `/request/${rideId}/accept`,
  CHECK_DRIVER: (userId) => `/users/${userId}/driverCheck`,
  SEARCH_RESULTS: '/search/result',
  PENDING_REQUESTS: (userId) => `/users/${userId}/requests/pending`,
};

export default NEXT_ROUTES;
