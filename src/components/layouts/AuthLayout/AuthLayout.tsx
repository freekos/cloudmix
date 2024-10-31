import Logo from '@/../public/logo.svg';
import clsx from 'clsx';
import Image from 'next/image';
import { ComponentPropsWithoutRef } from 'react';
import styles from './AuthLayout.module.scss';

interface AuthLayoutProps extends ComponentPropsWithoutRef<'div'> {
  title: string;
}

export const AuthLayout = ({
  children,
  className,
  title,
  ...props
}: AuthLayoutProps) => {
  return (
    <div className={clsx(styles.auth_layout, className)} {...props}>
      <Image className={styles.logo} src={Logo} alt="Logo" />
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
