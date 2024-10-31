import { Button } from '@/components/atoms/Button';
import { ErrorMessage, getErrorMessage } from '@/components/atoms/ErrorMessage';
import { PasswordInput } from '@/components/atoms/PasswordInput';
import { TextInput } from '@/components/atoms/TextInput';
import { SignInFormReturn } from '@/hooks/useSignInForm';
import clsx from 'clsx';
import { ComponentPropsWithoutRef } from 'react';
import { Controller } from 'react-hook-form';
import styles from './SignInForm.module.scss';

interface SignInFormProps
  extends Omit<ComponentPropsWithoutRef<'form'>, 'children'> {
  form: SignInFormReturn;
}

export const SignInForm = ({ form, className, ...props }: SignInFormProps) => {
  return (
    <form className={clsx(styles.signin_form, className)} {...props}>
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
        Sign in
      </Button>
    </form>
  );
};
