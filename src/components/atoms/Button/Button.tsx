'use client';
import { UnstyledButton } from '@mantine/core';
import clsx from 'clsx';
import { ComponentPropsWithRef, forwardRef } from 'react';
import { Loader } from '../Loader';
import styles from './Button.module.scss';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, disabled, loading, ...props }, ref) => {
    return (
      <UnstyledButton
        ref={ref}
        className={clsx(styles.button, className)}
        aria-busy={loading}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader size="sm" /> : <>{children}</>}
      </UnstyledButton>
    );
  },
);
