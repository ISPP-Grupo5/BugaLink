const NEXT_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: (userId) => `/users/${userId}`,
  MY_ROUTINES: (userId) => `/users/${userId}/routines`,
  RIDE_HISTORY: (userId) => `/users/${userId}/history`,
  RIDE_DETAILS_ONE: (rideId) => `/ride/${rideId}/detailsOne`,
  RIDE_DETAILS_TWO: (rideId) => `/ride/${rideId}/detailsTwo`,
  RIDE_MAP: (rideId) => `/ride/${rideId}/map`,
  NEW_ROUTINE_DRIVER: (userId) => `/users/${userId}/routines/driver/new`,
  EDIT_ROUTINE_DRIVER: (userId, routineId) => `/users/${userId}/routines/driver/${routineId}`,
  NEW_ROUTINE_PASSENGER: (userId) => `/users/${userId}/routines/passenger/new`,
  EDIT_ROUTINE_PASSENGER: (userId, routineId) => `/users/${userId}/routines/passenger/${routineId}`,
  ACCEPT_RIDE: (rideId) => `/request/${rideId}/accept`,
  SEARCH_RESULTS: '/search/result',
  PENDING_REQUESTS: (userId) => `/users/${userId}/requests/pending`,
};

export default NEXT_ROUTES;
