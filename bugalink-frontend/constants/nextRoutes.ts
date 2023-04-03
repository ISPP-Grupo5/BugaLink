const NEXT_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGN_UP: '/signup',
  PROFILE: (userId) => `/users/${userId}`,
  EDIT_PROFILE: (userId) => `/users/${userId}/edit`, // TODO: replace with /profile/edit to avoid people guessing other user's ids
  RECHARGE_CREDIT: '/wallet/recharge',
  WITHDRAW_CREDIT: '/wallet/withdraw',
  MY_ROUTINES: `/routines`,
  RIDE_HISTORY: '/history',
  RIDE_DETAILS_ONE: (rideId, requested = false) =>
    `/ride/${rideId}/detailsOne?requested=${requested}`,
  RIDE_DETAILS_TWO: (rideId) => `/ride/${rideId}/detailsTwo`,
  RIDE_MAP: (rideId) => `/ride/${rideId}/map`,
  RATING_RIDE: (userId) => `/users/${userId}/rating/new`,
  NEW_ROUTINE_DRIVER: '/routines/driver/new',
  NEW_ROUTINE_PASSENGER: '/routines/passenger/new',
  ACCEPT_RIDE: (rideId) => `/request/${rideId}/accept`,
  CHECK_DRIVER: (userId) => `/users/${userId}/driverCheck`,
  SEARCH_RESULTS: '/search/result',
  PENDING_REQUESTS: '/requests/pending',
};

export default NEXT_ROUTES;
