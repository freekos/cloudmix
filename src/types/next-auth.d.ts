import 'next-auth';
import { DefaultSession } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: number;
    username: string;
  }
  interface Session extends DefaultSession {
    accessToken: string;
    refreshToken: string;
    user: User;
  }
  interface JWT extends DefaultJWT {
    accessToken: string;
    refreshToken: string;
    user: User;
  }
}
