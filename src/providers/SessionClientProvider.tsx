'use client';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { PropsWithChildren } from 'react';

interface SessionClientProviderProps extends PropsWithChildren {
  session: Session | null;
}

export const SessionClientProvider = ({
  children,
  session,
}: SessionClientProviderProps) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};
