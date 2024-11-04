import Logo from '@/../public/logo.svg';
import Image from 'next/image';
import { PropsWithChildren } from 'react';
import { AuthRouteClient } from './AuthRouteClient';
import styles from './layout.module.scss';

export default async function AuthLayout({ children }: PropsWithChildren) {
  return (
    <AuthRouteClient>
      <div className={styles.auth_layout}>
        <Image className={styles.logo} src={Logo} alt="Logo" />
        {children}
      </div>
    </AuthRouteClient>
  );
}
