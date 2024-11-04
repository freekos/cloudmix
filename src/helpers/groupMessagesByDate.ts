import { TMessageItem } from '@/types/messageItem';

export function groupMessagesByDate(messages: TMessageItem[]) {
  const groupedMessages = messages.reduce(
    (acc, message) => {
      const date = new Date(message.createdAt ?? '');
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }
      acc[formattedDate].push(message);

      return acc;
    },
    {} as Record<string, TMessageItem[]>,
  );

  return Object.keys(groupedMessages).map((key) => ({
    date: key,
    messages: groupedMessages[key],
  }));
}
