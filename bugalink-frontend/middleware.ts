import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import NEXT_ROUTES from './constants/nextRoutes';

export async function middleware(req) {
  if (
    // Redirect to login page when visiting without a session
    // any page except /api, /signup, /login, and many more that
    // are used internally by Next.js
    !/(api|signup|login|sw.js|workbox|icons|_next\/static|_next\/image|manifest.json|\/favicon.ico).*/.test(
      req.nextUrl.pathname
    )
  ) {
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
