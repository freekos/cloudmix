'use client';

import { EmptyMessage } from '@/components/atoms/EmptyMessage';
import { Loader } from '@/components/atoms/Loader';
import { SearchInput } from '@/components/atoms/SearchInput';
import { ChatItem } from '@/components/molecules/ChatItem';
import { useChats } from '@/hooks/useChats';
import { useMessages } from '@/providers/MesagesProvider';
import { useWebsocket } from '@/providers/WebsocketProvider';
import { TChatItem } from '@/types/chatItem';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './ChatsPanel.module.scss';

export const ChatsPanel = () => {
  const params = useParams();
  const router = useRouter();
  const session = useSession();
  const userId = session.data?.user.id;

  const chatId = params?.chatId as string | undefined;

  const [typingChatId, setTypingChatId] = useState<string | undefined>(
    undefined,
  );
  const { resultMessages, unreadMessages } = useMessages();
  const { chats, isLoading, search, setSearch } = useChats(
    chatId,
    resultMessages,
  );
  const { subscribeToMessage } = useWebsocket();

  const resultChats = useMemo(() => {
    return chats.map((chat) => {
      const messagesCount = unreadMessages.filter(
        (message) => message.chatId === chat.id,
      ).length;

      const userNames = chat.users
        ? chat.users
            .filter((user) => user.id !== userId)
            .map((user) => user.username)
        : [];

      return {
        ...chat,
        userNames,
        messagesCount,
        isTyping: typingChatId === chat.id,
      };
    });
  }, [chats, unreadMessages, typingChatId]);

  const handleMessage = useCallback((event: MessageEvent) => {
    const data = JSON.parse(event.data);
    if (data.topic === 'typing') {
      if (data.status) {
        setTypingChatId(data.chat.id);
      } else {
        setTypingChatId(undefined);
      }
    }
  }, []);

  const handleChatClick = (chat: TChatItem) => () => {
    if (!chat.isGroup) {
      const user = chat.users!.find((user) => user.id !== userId);
      if (!user) {
        return;
      }

      router.push(`/chat/private/${user.id}`);
    } else {
      router.push(`/chat/group/${chat.id}`);
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToMessage(handleMessage);

    return () => {
      unsubscribe();
    };
  }, [handleMessage]);

  return (
    <div className={styles.chats_panel}>
      <div className={styles.header}>
        <SearchInput
          placeholder="Search by username or group name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.loader}>
            <Loader size="md" />
          </div>
        ) : resultChats.length === 0 ? (
          <EmptyMessage>
            <ChatBubbleLeftRightIcon width={50} height={50} />
            <span>No chats found</span>
          </EmptyMessage>
        ) : (
          resultChats.map((chat) => {
            return (
              <ChatItem
                key={chat.id}
                userNames={chat.userNames}
                messagesCount={chat.messagesCount}
                message={chat.messages![0]}
                isActive={chatId === chat.id}
                isTyping={chat.isTyping}
                onClick={handleChatClick(chat)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
