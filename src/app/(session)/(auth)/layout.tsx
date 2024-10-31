import { PropsWithChildren } from 'react';
import { AuthRouteClient } from './AuthRouteClient';

export default async function AuthLayout({ children }: PropsWithChildren) {
  return <AuthRouteClient>{children}</AuthRouteClient>;
}
