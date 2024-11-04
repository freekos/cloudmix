'use client';

import { Tabs } from '@/components/atoms/Tabs';
import { useMessages } from '@/providers/MesagesProvider';
import {
  ChatBubbleBottomCenterIcon,
  CloudIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Badge } from '@mantine/core';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useEffect, useMemo } from 'react';
import styles from './ChatSidebar.module.scss';
import { BotsPanel } from './components/BotsPanel';
import { ChatsPanel } from './components/ChatsPanel';
import { UsersPanel } from './components/UsersPanel';

enum ChatSidebarTabs {
  Chats = 'chats',
  Users = 'users',
  Bots = 'bots',
}

function isChatSidebarTab(value: string | null) {
  return Object.values(ChatSidebarTabs).includes(value as ChatSidebarTabs);
}

export const ChatSidebar = () => {
  const { unreadMessages } = useMessages();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();

  const chatId = params?.chatId;
  const userId = params?.userId;
  const tab = searchParams.get('tab');

  const activeTab = useMemo(() => {
    return isChatSidebarTab(tab)
      ? (tab as ChatSidebarTabs)
      : ChatSidebarTabs.Chats;
  }, [tab]);

  const unreadMessagesChatsCount = useMemo(() => {
    const unreadChats = new Set();

    unreadMessages.forEach((message) => {
      unreadChats.add(message.chatId);
    });

    return unreadChats.size;
  }, [unreadMessages]);

  const handleTabChange = (value: string | null) => {
    if (!value) {
      return;
    }

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tab', value);
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  useEffect(() => {
    if (!isChatSidebarTab(tab)) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('tab', ChatSidebarTabs.Chats);
      router.replace(`${pathname}?${newSearchParams.toString()}`);
    }
  }, [tab, pathname, router]);

  return (
    <aside className={styles.sidebar} data-visible={!chatId && !userId}>
      <Tabs value={activeTab} onChange={handleTabChange} keepMounted={false}>
        <Tabs.List grow>
          <Tabs.Tab
            value={ChatSidebarTabs.Chats}
            leftSection={
              <ChatBubbleBottomCenterIcon
                className={styles.chat_icon}
                width={20}
                height={20}
              />
            }
            rightSection={
              unreadMessagesChatsCount > 0 && (
                <Badge className={styles.badge}>
                  {unreadMessagesChatsCount}
                </Badge>
              )
            }
          >
            Chats
          </Tabs.Tab>
          <Tabs.Tab
            value={ChatSidebarTabs.Users}
            leftSection={
              <UserIcon className={styles.user_icon} width={20} height={20} />
            }
          >
            Users
          </Tabs.Tab>
          <Tabs.Tab
            value={ChatSidebarTabs.Bots}
            leftSection={
              <CloudIcon className={styles.bot_icon} width={20} height={20} />
            }
          >
            Bots
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value={ChatSidebarTabs.Chats}>
          <ChatsPanel />
        </Tabs.Panel>
        <Tabs.Panel value={ChatSidebarTabs.Users}>
          <UsersPanel />
        </Tabs.Panel>
        <Tabs.Panel value={ChatSidebarTabs.Bots}>
          <BotsPanel />
        </Tabs.Panel>
      </Tabs>
    </aside>
  );
};
