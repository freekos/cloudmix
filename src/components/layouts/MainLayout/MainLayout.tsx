import clsx from 'clsx';
import { ComponentPropsWithoutRef } from 'react';
import styles from './MainLayout.module.scss';

interface MainLayoutProps extends ComponentPropsWithoutRef<'div'> {}

export const MainLayout = ({
  children,
  className,
  ...props
}: MainLayoutProps) => {
  return (
    <div className={clsx(styles.main_layout, className)} {...props}>
      {children}
    </div>
  );
};
