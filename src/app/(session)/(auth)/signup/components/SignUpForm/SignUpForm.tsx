'use client';

import { Button } from '@/components/atoms/Button';
import { ErrorMessage, getErrorMessage } from '@/components/atoms/ErrorMessage';
import { PasswordInput } from '@/components/atoms/PasswordInput';
import { TextInput } from '@/components/atoms/TextInput';
import { useSignUpForm } from '@/hooks/useSignUpForm';
import { authApi } from '@/services/api/auth';
import { useRouter } from 'next/navigation';
import { Controller } from 'react-hook-form';
import styles from './SignUpForm.module.scss';

export const SignUpForm = () => {
  const form = useSignUpForm();
  const router = useRouter();

  const handleSignUp = form.handleSubmit(async (data) => {
    try {
      const res = await authApi.register({
        username: data.username,
        password: data.password,
      });

      router.push('/signin');
    } catch (error) {
      console.log(error);
      let errorMessage = 'Something went wrong';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      form.setError('root', {
        type: 'server',
        message: errorMessage,
      });
    }
  });

  return (
    <form className={styles.signup_form} onSubmit={handleSignUp}>
      <fieldset
        className={styles.fields}
        disabled={form.formState.isSubmitting}
      >
        <Controller
          control={form.control}
          name="username"
          render={({ field, fieldState, formState }) => (
            <TextInput
              type="text"
              label="Username"
              placeholder="Enter username"
              error={getErrorMessage(fieldState, formState)}
              {...field}
            />
          )}
        />
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState, formState }) => (
            <PasswordInput
              type="password"
              label="Password"
              placeholder="Enter password"
              error={getErrorMessage(fieldState, formState)}
              {...field}
            />
          )}
        />
        <Controller
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState, formState }) => (
            <PasswordInput
              type="password"
              label="Confirm password"
              placeholder="Confirm password"
              error={getErrorMessage(fieldState, formState)}
              {...field}
            />
          )}
        />
        {form.formState.errors.root?.message && (
          <ErrorMessage>{form.formState.errors.root.message}</ErrorMessage>
        )}
      </fieldset>
      <Button
        type="submit"
        disabled={!form.formState.isValid}
        loading={form.formState.isSubmitting}
      >
        Register
      </Button>
    </form>
  );
};
