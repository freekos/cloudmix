import { MessageStatus } from '@/constants/messageStatus';
import { getStatusText } from '@/helpers/getStatusText';
import { format } from 'date-fns';
import styles from './MessageItem.module.scss';

interface MessageItemProps {
  isMine: boolean;
  content: string;
  createdAt: string;
  status?: MessageStatus;
}

export const MessageItem = ({
  isMine,
  content,
  createdAt,
  status,
}: MessageItemProps) => {
  const timeText = format(createdAt, 'HH:mm');

  return (
    <div className={styles.message_item} data-is-mine={isMine}>
      <span className={styles.content}>{content}</span>
      <div className={styles.meta}>
        <span className={styles.time}>{timeText}</span>
        {isMine && (
          <span className={styles.delivery}>{getStatusText(status)}</span>
        )}
      </div>
    </div>
  );
};
