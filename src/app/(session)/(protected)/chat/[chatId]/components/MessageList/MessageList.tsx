import { Divider } from '@/components/atoms/Divider';
import { MessageItem } from '@/components/molecules/MessageItem';
import styles from './MessageList.module.scss';

interface MessageListProps {}

export const MessageList = () => {
  return (
    <div className={styles.message_list}>
      <Divider
        classNames={{
          label: styles.divider_label,
        }}
        my="xl"
        label="Today"
      />
      <MessageItem content="Hello my friend" isOwn={true} isDelivered={true} />
      <MessageItem
        content="LoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLorem"
        isOwn={true}
        isDelivered={true}
      />
      <MessageItem content="Hello my friend" isOwn={true} isDelivered={true} />
      <MessageItem content="Hello my friend" isOwn={false} />
      <MessageItem content="Hello my friend" isOwn={false} />
      <MessageItem content="Hello my friend" isOwn={false} />
      <MessageItem content="Hello my friend" isOwn={false} />
      <MessageItem content="Hello my friend" isOwn={false} />
      <MessageItem content="Hello my friend" isOwn={false} />
      <MessageItem content="Hello my friend" isOwn={false} />
    </div>
  );
};
