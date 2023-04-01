import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import NEXT_ROUTES from './constants/nextRoutes';

export async function middleware(req) {
  // TODO: redirect to login page if not authenticated
  // in all pages except /login and /signup
  // This is tricky because internally next.js uses some
  // patnhames like /workbox-*.js.map and /_next/data/...
  // so we have to consider al those cases, probably
  // in some sort of regex. Currently we are only checking
  // for redirecting in the main "/" page
  if ([NEXT_ROUTES.HOME].includes(req.nextUrl.pathname)) {
    const token = await getToken({ req });
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = NEXT_ROUTES.LOGIN;
      return NextResponse.rewrite(url);
    }
  }

  // Redirect to home page when visiting /signup or /login if authenticated
  if ([NEXT_ROUTES.LOGIN, NEXT_ROUTES.SIGN_UP].includes(req.nextUrl.pathname)) {
    const token = await getToken({ req });
    if (token) {
      const url = req.nextUrl.clone();
      url.pathname = NEXT_ROUTES.HOME;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}
