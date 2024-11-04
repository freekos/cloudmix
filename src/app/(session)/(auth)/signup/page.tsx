'use client';

import styles from './page.module.scss';

import { Divider } from '@/components/atoms/Divider';
import { NextLink } from '@/components/atoms/NextLink';
import { SignUpForm } from './components/SignUpForm';

export default function SignUp() {
  return (
    <div className={styles.signup_page}>
      <h1 className={styles.title}>Sign up</h1>
      <div className={styles.content}>
        <SignUpForm />
        <Divider my="lg" label="OR" />
        <NextLink href="/signin">Sign in</NextLink>
      </div>
    </div>
  );
}
