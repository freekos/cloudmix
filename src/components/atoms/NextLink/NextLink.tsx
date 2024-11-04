import clsx from 'clsx';
import Link from 'next/link';
import { ComponentPropsWithoutRef } from 'react';
import styles from './NextLink.module.scss';

export interface NextLinkProps extends ComponentPropsWithoutRef<typeof Link> {}

export const NextLink = ({ children, className, ...props }: NextLinkProps) => {
  return (
    <Link className={clsx(styles.next_link, className)} {...props}>
      {children}
    </Link>
  );
};
