import { MessageStatus } from '@/constants/messageStatus';
import { getStatusText } from '@/helpers/getStatusText';
import { TMessageModel } from '@/types/models';
import clsx from 'clsx';
import { format } from 'date-fns';
import { ComponentPropsWithoutRef } from 'react';
import styles from './ChatItem.module.scss';

interface ChatItemProps extends ComponentPropsWithoutRef<'button'> {
  isMine?: boolean;
  userNames: string[];
  message?: Pick<TMessageModel, 'content' | 'createdAt'>;
  messagesCount: number;
  status?: MessageStatus;
  isActive: boolean;
  isTyping?: boolean;
}

export const ChatItem = ({
  className,
  isMine,
  userNames,
  message,
  messagesCount,
  status,
  isActive,
  isTyping,
  ...props
}: ChatItemProps) => {
  const getTimeText = (date: string) => {
    return format(date, 'HH:mm');
  };

  return (
    <button
      className={clsx(styles.chat_item, className)}
      data-active={isActive}
      {...props}
    >
      <div className={styles.top}>
        <span className={styles.username}>{userNames.join(', ')}</span>
        {isTyping && isMine ? null : isMine ? (
          <span data-testid="status">{getStatusText(status)}</span>
        ) : (
          messagesCount > 0 && (
            <span
              className={styles.messages_count}
              data-testid="messages_count"
            >
              {messagesCount}
            </span>
          )
        )}
      </div>
      <div className={styles.bottom}>
        {isTyping ? (
          <span className={styles.typing}>...typing</span>
        ) : message ? (
          <>
            <span className={styles.message}>{message.content}</span>
            <span className={styles.time}>
              {getTimeText(message.createdAt)}
            </span>
          </>
        ) : null}
      </div>
    </button>
  );
};
