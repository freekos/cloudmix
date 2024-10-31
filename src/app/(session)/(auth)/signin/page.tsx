'use client';

import { SignInForm } from '@/app/(session)/(auth)/signin/components/SignInForm';
import { NextLink } from '@/components/atoms/NextLink';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { useSignInForm } from '@/hooks/useSignInForm';
import { signIn } from 'next-auth/react';

import { Divider } from '@/components/atoms/Divider';
import styles from './page.module.scss';

export default function SignInPage() {
  const signInForm = useSignInForm();

  const handleSignIn = signInForm.handleSubmit(async (data) => {
    const res = await signIn('credentials', {
      username: data.username,
      password: data.password,
      redirect: false,
    });
    console.log(res);

    if (!res?.ok) {
      signInForm.setError('root', {
        message: res?.error ?? 'Something went wrong',
      });
      return;
    }

    signInForm.reset();
  });

  return (
    <AuthLayout title="Sign in">
      <div className={styles.signin_page}>
        <SignInForm form={signInForm} onSubmit={handleSignIn} />
        <Divider my="lg" label="OR" />
        <NextLink href="/signup">Sign up</NextLink>
      </div>
    </AuthLayout>
  );
}
