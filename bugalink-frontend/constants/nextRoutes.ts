const NEXT_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGN_UP: '/signup',
  PROFILE: (userId) => `/users/${userId}`,
  EDIT_PROFILE: (userId) => `/users/${userId}/edit`, // TODO: replace with /profile/edit to avoid people guessing other user's ids
  WALLET: '/wallet',
  RECHARGE_CREDIT: '/wallet/recharge',
  WITHDRAW_CREDIT: '/wallet/withdraw',
  MY_ROUTINES: `/routines`,
  RIDE_HISTORY: '/history',
  RIDE_DETAILS: (rideId, requested = false) =>
    `/ride/${rideId}/details?requested=${requested}`,
  RIDE_MAP: (rideId) => `/ride/${rideId}/map`,
  RIDE_PAYMENT: (rideId) => `/ride/${rideId}/pay`,
  RATING_RIDE: (userId) => `/users/${userId}/rating/new`,
  NEW_ROUTINE_DRIVER: '/routines/driver/new',
  NEW_ROUTINE_PASSENGER: '/routines/passenger/new',
  ACCEPT_RIDE: (rideId) => `/request/${rideId}/accept`,
  BECOME_DRIVER: '/become-driver',
  SEARCH_RESULTS: '/search/result',
  PENDING_REQUESTS: '/requests/pending',
};

export default NEXT_ROUTES;
