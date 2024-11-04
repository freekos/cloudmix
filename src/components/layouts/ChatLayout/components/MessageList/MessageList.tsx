import { Divider } from '@/components/atoms/Divider';
import { MessageItem } from '@/components/molecules/MessageItem';
import { getMessageStatus } from '@/helpers/getMessageStatus';
import { groupMessagesByDate } from '@/helpers/groupMessagesByDate';
import { TMessageItem } from '@/types/messageItem';
import { isToday } from 'date-fns';
import { useSession } from 'next-auth/react';
import styles from './MessageList.module.scss';

interface MessageListProps {
  messages: TMessageItem[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const session = useSession();
  const userId = session.data?.user.id;
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className={styles.message_list}>
      {groupedMessages.map((group) => (
        <div key={group.date} className={styles.date}>
          <Divider
            classNames={{
              label: styles.divider_label,
            }}
            my="xl"
            label={isToday(group.date) ? 'Today' : group.date}
          />
          <div className={styles.list}>
            {group.messages.map((message) => (
              <MessageItem
                key={message.id}
                content={message?.content ?? ''}
                createdAt={message?.createdAt ?? ''}
                isMine={message.senderId === userId}
                status={getMessageStatus(message)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
