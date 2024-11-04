import { PropsWithChildren } from 'react';

import { ChatSidebar } from '@/components/layouts/ChatSidebar';
import { MessagesProvider } from '@/providers/MesagesProvider';
import styles from './layout.module.scss';

export default function ChatLayout({ children }: PropsWithChildren) {
  return (
    <MessagesProvider>
      <div className={styles.chat_layout}>
        <ChatSidebar />
        <div className={styles.content}>{children}</div>
      </div>
    </MessagesProvider>
  );
}
