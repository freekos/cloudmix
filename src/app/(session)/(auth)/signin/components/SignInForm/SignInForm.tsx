import { Button } from '@/components/atoms/Button';
import { ErrorMessage, getErrorMessage } from '@/components/atoms/ErrorMessage';
import { PasswordInput } from '@/components/atoms/PasswordInput';
import { TextInput } from '@/components/atoms/TextInput';
import { useSignInForm } from '@/hooks/useSignInForm';
import { signIn } from 'next-auth/react';
import { Controller } from 'react-hook-form';
import styles from './SignInForm.module.scss';

export const SignInForm = () => {
  const form = useSignInForm();

  const handleSignIn = form.handleSubmit(async (data) => {
    try {
      const res = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false,
      });
      console.log(res);

      if (!res?.ok) {
        form.setError('root', {
          message: res?.error ?? 'Something went wrong',
        });
        return;
      }

      form.reset();
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <form className={styles.signin_form} onSubmit={handleSignIn}>
      <fieldset
        className={styles.fields}
        disabled={form.formState.isSubmitting}
      >
        <Controller
          control={form.control}
          name="username"
          render={({ field, fieldState, formState }) => (
            <TextInput
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
              label="Password"
              placeholder="Enter password"
              error={getErrorMessage(fieldState, formState)}
              {...field}
            />
          )}
        />
        {form.formState.errors.root?.message && (
          <ErrorMessage>{form.formState.errors.root?.message}</ErrorMessage>
        )}
      </fieldset>
      <Button
        type="submit"
        disabled={!form.formState.isValid}
        loading={form.formState.isSubmitting}
      >
        Login
      </Button>
    </form>
  );
};
