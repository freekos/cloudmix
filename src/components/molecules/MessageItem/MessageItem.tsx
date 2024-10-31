import clsx from 'clsx';
import { ComponentProps } from 'react';
import styles from './MessageItem.module.scss';

interface MessageItemProps extends Omit<ComponentProps<'div'>, 'children'> {
  content: string;
  isOwn?: boolean;
  isDelivered?: boolean;
}

export const MessageItem = ({
  className,
  content,
  isOwn,
  isDelivered,
  ...props
}: MessageItemProps) => {
  return (
    <div
      className={clsx(styles.message_item, className)}
      data-own={isOwn}
      {...props}
    >
      <span className={styles.content}>{content}</span>
      <div className={styles.meta}>
        <span className={styles.time}>10:21</span>
        {isOwn && (
          <span className={styles.delivery}>
            {isDelivered ? 'Delivered' : 'Delivery failed'}
          </span>
        )}
      </div>
    </div>
  );
};
