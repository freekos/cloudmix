import { PropsWithChildren } from 'react';

import { ChatSidebar } from '@/components/layouts/ChatSidebar';
import styles from './layout.module.scss';

export default function ChatLayout({ children }: PropsWithChildren) {
  return (
    <div className={styles.chat_layout}>
      <ChatSidebar />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
