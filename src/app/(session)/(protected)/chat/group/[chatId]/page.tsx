import { ChatLayout } from '@/components/layouts/ChatLayout';

export default function ChatGroupPage() {
  return (
    <ChatLayout isInputDisabled={false} users={[]} chatId="1" onSend={() => {}}>
      Group Page
    </ChatLayout>
  );
}
