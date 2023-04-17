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
  TRIP_HISTORY: '/history',
  TRIP_DETAILS: (tripId) => `/trips/${tripId}`,
  TRIP_MAP: (tripId) => `/trips/${tripId}/map`,
  TRIP_PAYMENT: (tripId) => `/trips/${tripId}/pay`,
  TRIP_PAYMENT_CREDIT: (tripId) => `/trips/${tripId}/pay/credit`,
  RATING_TRIP: (tripId) => `/trips/${tripId}/rating/new`,
  NEW_ROUTINE_DRIVER: '/routines/driver/new',
  NEW_ROUTINE_PASSENGER: '/routines/passenger/new',
  BECOME_DRIVER: '/become-driver',
  ACCEPT_TRIP_REQUEST: (tripId) => `/requests/${tripId}`,
  SEARCH_RESULTS: '/search/result',
  PENDING_REQUESTS: '/requests/pending',
  CHAT_LIST: '/chats',
  CHAT: (userId) => `/users/${userId}/chat`,
};

export default NEXT_ROUTES;
