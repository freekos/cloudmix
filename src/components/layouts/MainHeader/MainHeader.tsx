'use client';

import Logo from '@/../public/logo.svg';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import styles from './MainHeader.module.scss';

export const MainHeader = () => {
  const session = useSession();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className={styles.main_header}>
      <Image className={styles.logo} src={Logo} alt="logo" />
      <div className={styles.right}>
        <span className={styles.username}>
          {session.data?.user?.username ?? 'No username'}
        </span>
        <button className={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};
