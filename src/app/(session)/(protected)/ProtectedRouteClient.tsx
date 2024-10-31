'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PropsWithChildren, useEffect } from 'react';

export const ProtectedRouteClient = ({ children }: PropsWithChildren) => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!!session.data?.user) return;
    router.replace('/signin');
  }, [session?.data?.user]);

  if (!session?.data?.user) {
    return null;
  }

  return <>{children}</>;
};
