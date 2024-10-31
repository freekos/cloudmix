import clsx from 'clsx';
import { ComponentProps } from 'react';
import styles from './ChatItem.module.scss';

interface ChatItemProps extends Omit<ComponentProps<'button'>, 'children'> {
  name: string;
  newMessageCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
  isActive?: boolean;
  isTyping?: boolean;
}

export const ChatItem = ({
  className,
  name,
  newMessageCount,
  lastMessage,
  lastMessageTime,
  isActive = false,
  isTyping = false,
  ...props
}: ChatItemProps) => {
  return (
    <button
      className={clsx(styles.chat_item, className)}
      data-active={isActive}
      {...props}
    >
      <div className={styles.top}>
        <span className={styles.sender}>{name}</span>
        {newMessageCount && (
          <span className={styles.new_message_count}>{newMessageCount}</span>
        )}
      </div>
      <div className={styles.bottom}>
        {isTyping ? (
          <span className={styles.typing}>...typing</span>
        ) : (
          <>
            {lastMessage && (
              <span className={styles.message}>{lastMessage}</span>
            )}
            {lastMessageTime && (
              <span className={styles.time}>{lastMessageTime}</span>
            )}
          </>
        )}
      </div>
    </button>
  );
};
