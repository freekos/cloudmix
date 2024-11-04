'use client';

import { Loader } from '@/components/atoms/Loader';
import { ChatLayout } from '@/components/layouts/ChatLayout';
import { MessageList } from '@/components/layouts/ChatLayout/components/MessageList';
import { useChatByUserId } from '@/hooks/useChatByUserId';

import { MessageStatus } from '@/constants/messageStatus';
import { useUserQuery } from '@/hooks/useUserQuery';
import { useMessages } from '@/providers/MesagesProvider';
import { useWebsocket } from '@/providers/WebsocketProvider';
import { chatApi } from '@/services/api/chat';
import { TChatModel, TMessageReceiptModel } from '@/types/models';
import { TTemporaryMessage } from '@/types/temporaryMessage';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './page.module.scss';

export default function ChatPrivatePage() {
  const params = useParams();
  const userId = params?.userId as string;

  const userQuery = useUserQuery(userId);
  const { chat, isLoading, setChat } = useChatByUserId(userId);
  const {
    resultMessages,
    messages,
    setTemporaryMessages,
    handleGetMessages,
    setMessages,
    setUnreadMessages,
  } = useMessages();
  const { updateMessageReceipt, sendMessage } = useWebsocket();
  const session = useSession();
  const router = useRouter();

  const handleSendMessage = async (message: string) => {
    try {
      if (!session.data) {
        return;
      }

      const tempId = uuidv4();
      const temporaryMessage: TTemporaryMessage = {
        id: tempId,
        createdAt: new Date().toISOString(),
        content: message,
        senderId: session.data.user.id,
      };

      setTemporaryMessages((prev) => [...prev, temporaryMessage]);

      let resultChat: TChatModel;
      if (!chat) {
        resultChat = await chatApi.createChat({
          usersIds: [userId],
        });
        setChat(resultChat);
      } else {
        resultChat = chat;
      }

      sendMessage(resultChat.id, tempId, message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setMessages([]);

    if (!chat) {
      return;
    }

    handleGetMessages(chat.id);

    return () => {
      setMessages([]);
    };
  }, [chat]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        router.push('/chat');
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  useEffect(() => {
    if (!session.data) {
      return;
    }

    const receivedMessages = messages.filter(
      (message) => message.senderId !== session.data.user.id,
    );
    const receipts = receivedMessages
      .reduce((acc, message) => {
        if (message.receipts) {
          return [...acc, ...message.receipts];
        }
        return acc;
      }, [] as TMessageReceiptModel[])
      .filter((receipt) => receipt.userId === session.data.user.id);

    receipts.forEach(async (receipt) => {
      if (receipt.status === MessageStatus.READ) {
        return;
      }

      updateMessageReceipt(receipt.messageId, MessageStatus.READ);
      setUnreadMessages((prev) =>
        prev.filter((message) => message.id !== receipt.messageId),
      );
    });
  }, [messages, session]);

  return (
    <ChatLayout
      isInputDisabled={isLoading}
      users={userQuery.data ? [userQuery.data] : []}
      chatId={chat?.id}
      onSend={handleSendMessage}
    >
      <div className={styles.chat_private_page}>
        {userQuery.isLoading || isLoading ? (
          <div className={styles.loader}>
            <Loader size="md" />
          </div>
        ) : !resultMessages.length ? (
          <div className={styles.empty}>Write first message here</div>
        ) : (
          <MessageList messages={resultMessages} />
        )}
      </div>
    </ChatLayout>
  );
}
