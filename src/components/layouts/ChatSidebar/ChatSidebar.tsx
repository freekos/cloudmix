'use client';

import { TextInput } from '@/components/atoms/TextInput';
import { ChatItem } from '@/components/molecules/ChatItem';
import { useChatsQuery } from '@/hooks/useChatsQuery';
import { useUsersQuery } from '@/hooks/useUsersQuery';
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { Loader } from '@mantine/core';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './ChatSidebar.module.scss';

export const ChatSidebar = () => {
  const [search, setSearch] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const chatsQuery = useChatsQuery({ search });
  const usersQuery = useUsersQuery({ search });
  const router = useRouter();

  const params = useParams();
  const chatId = params?.chatId;

  return (
    <aside className={styles.sidebar} data-visible={!chatId}>
      <div className={styles.header}>
        <div className={styles.left} data-visible={isSearching}>
          <button className={styles.back} onClick={() => setIsSearching(false)}>
            <ArrowLeftIcon className={styles.icon} />
          </button>
        </div>
        <TextInput
          classNames={{
            root: styles.search,
            input: styles.search_input,
          }}
          placeholder="Search"
          leftSection={
            !isSearching ? (
              <MagnifyingGlassIcon className={styles.search_icon} />
            ) : null
          }
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onFocus={() => setIsSearching(true)}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.messages}>
          <span>Messages</span>
          <span>(3)</span>
        </div>
        <div className={styles.wrapper}>
          {chatsQuery.isLoading || usersQuery.isLoading ? (
            <Loader size="lg" />
          ) : (
            <div className={styles.list}>
              {chatsQuery.data?.map((chat) => (
                <ChatItem
                  key={chat.id}
                  name={
                    (chat.isGroup ? chat.name : chat.users[0].username) ??
                    'Unknown'
                  }
                  newMessageCount={chat.messages.length}
                  lastMessage={chat.messages[chat.messages.length - 1].content}
                  lastMessageTime={
                    chat.messages[chat.messages.length - 1].createdAt
                  }
                  isActive={chatId === chat.id}
                  onClick={() => {
                    if (chatId === chat.id) {
                      router.push(`/chat`);
                      return;
                    }
                    setIsSearching(false);
                    router.push(`/chat/${chat.id}`);
                  }}
                />
              ))}
              {usersQuery.data?.map((user) => (
                <ChatItem
                  key={user.id}
                  name={user.username}
                  isActive={chatId === user.id}
                  onClick={() => {
                    if (chatId === user.id) {
                      router.push(`/chat`);
                      return;
                    }
                    setIsSearching(false);
                    router.push(`/new-chat/${user.id}`);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
