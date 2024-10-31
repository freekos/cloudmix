import { Button } from '@/components/atoms/Button';
import { ErrorMessage, getErrorMessage } from '@/components/atoms/ErrorMessage';
import { PasswordInput } from '@/components/atoms/PasswordInput';
import { TextInput } from '@/components/atoms/TextInput';
import { SignUpFormReturn } from '@/hooks/useSignUpForm';
import clsx from 'clsx';
import { ComponentPropsWithoutRef } from 'react';
import { Controller } from 'react-hook-form';
import styles from './SignUpForm.module.scss';

interface SignUpFormProps
  extends Omit<ComponentPropsWithoutRef<'form'>, 'children'> {
  form: SignUpFormReturn;
}

export const SignUpForm = ({ form, className, ...props }: SignUpFormProps) => {
  return (
    <form className={clsx(styles.signup_form, className)} {...props}>
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
              placeholder="Username"
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
              placeholder="Password"
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
        Sign up
      </Button>
    </form>
  );
};
