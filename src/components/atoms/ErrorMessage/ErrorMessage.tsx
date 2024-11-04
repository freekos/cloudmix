import clsx from 'clsx';
import { ComponentPropsWithRef } from 'react';
import { ControllerFieldState, UseFormStateReturn } from 'react-hook-form';
import styles from './ErrorMessage.module.scss';

export interface ErrorMessageProps extends ComponentPropsWithRef<'p'> {}

export const ErrorMessage = ({
  children,
  className,
  ...props
}: ErrorMessageProps) => {
  if (!children) return null;

  return (
    <span className={clsx(styles.error_message, className)} {...props}>
      {children}
    </span>
  );
};

export const getErrorMessage = <T extends Record<string, any>>(
  fieldState: ControllerFieldState,
  formState: UseFormStateReturn<T>,
) => {
  if (!fieldState.error?.message && !formState.errors.root?.message) {
    return null;
  }

  return <ErrorMessage>{fieldState.error?.message}</ErrorMessage>;
};
