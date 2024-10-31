import { MainHeader } from '@/components/layouts/MainHeader';
import { PropsWithChildren } from 'react';
import { ProtectedRouteClient } from './ProtectedRouteClient';
import styles from './layout.module.scss';

export default async function ProtectedLayout({ children }: PropsWithChildren) {
  return (
    <ProtectedRouteClient>
      <div className={styles.protected_layout}>
        <MainHeader />
        {children}
      </div>
    </ProtectedRouteClient>
  );
}
