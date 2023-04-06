import NEXT_ROUTES from '@/constants/nextRoutes';
import axios from 'axios';
import type { NextAuthOptions } from 'next-auth';
import NextAuth, { Session, User } from 'next-auth';
import { CookiesOptions } from 'next-auth/core/types';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

const refreshAccessToken = async (refresh) => {
  const res = await axios.post('/auth/token/refresh/', { refresh });
  return res.data.access;
};

const providers = [
  // ...add more providers here
  CredentialsProvider({
    // The name to display on the sign in form (e.g. "Sign in with...")
    name: 'credentials',
    // `credentials` is used to generate a form on the sign in page.
    // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
      email: {
        label: 'Email',
        type: 'text',
        placeholder: 'ramon@example.com',
      },
      password: {
        label: 'Password',
        type: 'password',
      },
    },

    async authorize(credentials, req) {
      const { email, password } = credentials as any;
      const res = await fetch(
        `${process?.env?.NEXT_PUBLIC_BACKEND_URL || ''}/api/v1/auth/login/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();
      if (res.ok && data?.access) {
        return data;
      }
      return Promise.reject(new Error(data?.detail));
    },
  }),
];

export const authOptions: NextAuthOptions = {
  providers: providers,
  secret: process.env.NEXT_PUBLIC_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }: { token?: JWT; user?: User }) {
      // first call of jwt function just user object is provided
      if (user?.user_id) {
        return { ...token, ...user };
      }

      const currentToken = (user as unknown as JWT)?.access
        ? (user as unknown as JWT)
        : token;

      // on subsequent calls, token is provided and we need to check if it's expired
      if (currentToken?.exp) {
        if (Date.now() / 1000 < token?.exp) {
          return { ...token, ...user };
        } else if (currentToken?.refresh) {
          currentToken.refresh = await refreshAccessToken(token.refresh);
        }
      }

      if (!currentToken?.access) return { ...currentToken };
      const userData = JSON.parse(atob(currentToken.access.split('.')?.at(1)));
      return { ...userData, ...currentToken };
    },

    session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      if (Date.now() / 1000 > token?.exp) {
        return Promise.reject({
          error: new Error(
            'Refresh token has expired. Please log in again to get a new refresh token.'
          ),
        });
      }

      session = {
        ...session,
        user: {
          ...session.user,
          ...token,
        },
      };

      return Promise.resolve(session);
    },
  },

  pages: {
    error: NEXT_ROUTES.LOGIN,
    signIn: NEXT_ROUTES.LOGIN,
    signUp: NEXT_ROUTES.SIGN_UP,
  },
};

export default NextAuth(authOptions);
