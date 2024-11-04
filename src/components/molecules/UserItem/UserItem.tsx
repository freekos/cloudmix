import clsx from 'clsx';
import { ComponentPropsWithoutRef } from 'react';
import styles from './UserItem.module.scss';

interface UserItemProps extends ComponentPropsWithoutRef<'button'> {
  username: string;
  isOnline?: boolean;
}

export const UserItem = ({
  className,
  username,
  isOnline = false,
  ...props
}: UserItemProps) => {
  const onlineStatusText = isOnline ? 'Online' : 'Offline';

  return (
    <button className={clsx(styles.user_item, className)} {...props}>
      <span className={styles.username}>{username}</span>
      {<span className={styles.status}>{onlineStatusText}</span>}
    </button>
  );
};
