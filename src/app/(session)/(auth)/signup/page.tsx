'use client';

import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import styles from './page.module.scss';

import { Divider } from '@/components/atoms/Divider';
import { NextLink } from '@/components/atoms/NextLink';
import { useSignUpForm } from '@/hooks/useSignUpForm';
import { SignUpForm } from './components/SignUpForm';

export default function SignUp() {
  const signUpForm = useSignUpForm();
  const router = useRouter();

  const handleSignUp = signUpForm.handleSubmit(async (data) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const resJson = await res.json();
    if (!res.ok) {
      signUpForm.setError('root', {
        type: 'server',
        message: resJson.error,
      });
      return;
    }

    router.push('/signin');
  });

  return (
    <AuthLayout title="Sign up">
      <div className={styles.signup_page}>
        <SignUpForm form={signUpForm} onSubmit={handleSignUp} />
        <Divider my="lg" label="OR" />
        <NextLink href="/signin">Sign in</NextLink>
      </div>
    </AuthLayout>
  );
}
