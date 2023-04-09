// types/next-auth.d.ts

declare module 'next-auth' {
  import type { NextAuthOptions } from 'next-auth';
  /**
   * Returned by `useSession`, `getSession` and received as
   * a prop on the `SessionProvider` React Context
   */
  interface Session {
    token?: string;
    error?: string;
    user?: User;
  }

  interface User {
    token_type?: string;
    access: string;
    refresh: string;
    exp?: number;
    jti?: string;
    user_id?: number;
    passenger_id?: number;
    driver_id?: number | null;
    first_name?: string;
    last_name?: string;
    photo: string;
    verified: boolean;
    is_validated_driver: boolean;
    iat?: number;
  }
  export { NextAuthOptions, getServerSession, Session, User };
  export default NextAuth;
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    refreshTokenExpires?: number;
    accessTokenExpires?: number;
    refresh?: string;
    access: string;
    exp?: number;
    iat?: number;
    jti?: string;
  }

  export { JWT, getToken };
}
