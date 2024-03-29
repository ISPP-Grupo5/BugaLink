const NEXT_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGN_UP: '/signup',
  PROFILE: (userId) => `/users/${userId}`,
  EDIT_PROFILE: (userId) => `/users/${userId}/edit`,
  WALLET: '/wallet',
  RECHARGE_CREDIT: '/wallet/recharge',
  WITHDRAW_BALANCE: '/wallet/withdraw',
  WITHDRAW_SUCCESS: '/wallet/withdraw/success',
  MY_ROUTINES: `/routines`,
  TRIP_HISTORY: '/history',
  TRIP_DETAILS: (tripId) => `/trips/${tripId}`,
  TRIP_MAP: (tripId) => `/trips/${tripId}/map`,
  TRIP_PAYMENT: (tripId) => `/trips/${tripId}/pay`,
  PAY_SUCCESS: (tripId) => `/trips/${tripId}/pay/success`,
  TRIP_PAYMENT_CREDIT: (tripId) => `/trips/${tripId}/pay/credit`,
  RATING_TRIP: (tripId) => `/trips/${tripId}/rating/new`,
  NEW_ROUTINE_DRIVER: '/routines/driver/new',
  NEW_ROUTINE_PASSENGER: '/routines/passenger/new',
  BECOME_DRIVER: '/become-driver',
  ACCEPT_TRIP_REQUEST: (tripId) => `/requests/${tripId}`,
  SEARCH_RESULTS: '/search',
  PENDING_REQUESTS: '/requests/pending',
  CHAT_LIST: '/chats',
  CHAT: (userId) => `/users/${userId}/chat`,
};

export default NEXT_ROUTES;
