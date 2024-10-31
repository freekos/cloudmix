'use client';

import { useParams } from 'next/navigation';
import { Header } from './components/Header';
import { Input } from './components/Input';
import { MessageList } from './components/MessageList';
import styles from './page.module.scss';

export default function ChatDetailPage() {
  const params = useParams();
  const chatId = params?.chatId;

  return (
    <div className={styles.chat_detail_page}>
      <Header />
      <MessageList />
      <Input />
    </div>
  );
}
