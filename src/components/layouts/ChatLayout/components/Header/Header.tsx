'use client';

import { useWebsocket } from '@/providers/WebsocketProvider';
import { TUserModel } from '@/types/models';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useMediaQuery } from '@mantine/hooks';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './Header.module.scss';

interface HeaderProps {
  users: TUserModel[];
}

export function Header({ users }: HeaderProps) {
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const session = useSession();
  const { subscribeToMessage, subscribeUserUpdates, unsubscribeUserUpdates } =
    useWebsocket();
  const router = useRouter();
  const matches = useMediaQuery('(max-width: 500px)');

  const userNames = useMemo(() => {
    return users
      .filter((user) => user.id !== session.data?.user.id)
      .map((user) => user.username);
  }, [users]);
  const userIds = useMemo(() => {
    if (!users.length || !session.data) {
      return [];
    }

    return users
      .filter((user) => user.id !== session.data.user.id)
      .map((user) => user.id);
  }, [users, session]);

  const handleMessage = useCallback((event: MessageEvent) => {
    const data = JSON.parse(event.data);

    if (data.topic === 'typing') {
      setIsTyping(data.status);
    }
    if (data.topic === 'updatedUser') {
      setIsOnline(data.status);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToMessage(handleMessage);

    return () => {
      unsubscribe();
    };
  }, [handleMessage]);

  useEffect(() => {
    subscribeUserUpdates(userIds);

    return () => {
      unsubscribeUserUpdates(userIds);
    };
  }, [subscribeUserUpdates, userIds]);

  return (
    <header className={styles.header}>
      {matches && (
        <div className={styles.left}>
          <button className={styles.back} onClick={() => router.push('/chat')}>
            <ChevronLeftIcon width={20} height={20} />
          </button>
        </div>
      )}
      <div className={styles.right}>
        <span className={styles.username}>{userNames.join(', ')}</span>
        <span className={styles.status}>
          {isTyping ? 'Typing...' : isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
    </header>
  );
}
