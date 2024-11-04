'use client';

import clsx from 'clsx';
import { ComponentPropsWithoutRef } from 'react';
import styles from './EmptyMessage.module.scss';

export interface EmptyMessageProps extends ComponentPropsWithoutRef<'div'> {}

export const EmptyMessage = ({
  children,
  className,
  ...props
}: EmptyMessageProps) => {
  return (
    <div className={clsx(styles.empty_message, className)} {...props}>
      {children}
    </div>
  );
};
