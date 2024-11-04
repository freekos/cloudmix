'use client';

import { SignInForm } from '@/app/(session)/(auth)/signin/components/SignInForm';
import { NextLink } from '@/components/atoms/NextLink';

import { Divider } from '@/components/atoms/Divider';
import styles from './page.module.scss';

export default function SignInPage() {
  return (
    <div className={styles.signin_page}>
      <h1 className={styles.title}>Sign in</h1>
      <div className={styles.content}>
        <SignInForm />
        <Divider my="lg" label="OR" />
        <NextLink href="/signup">Sign up</NextLink>
      </div>
    </div>
  );
}
