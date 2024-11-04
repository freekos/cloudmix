import { useWebsocket } from '@/providers/WebsocketProvider';
import { chatApi } from '@/services/api/chat';
import { TUserItem } from '@/types/userItem';
import { useDebouncedValue } from '@mantine/hooks';
import { useCallback, useEffect, useState } from 'react';

export const useUsers = () => {
  const [users, setUsers] = useState<TUserItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const { subscribeToMessage } = useWebsocket();
  const [debouncedSearch] = useDebouncedValue(search, 500);

  const handleMessage = useCallback((event: MessageEvent) => {
    const data = JSON.parse(event.data);
    if (data.topic === 'updatedUser') {
      setUsers((prev) => {
        const user = prev.find((user) => user.id === data.user.id);
        if (!user || user.isOnline === data.status) {
          return prev;
        }

        return prev.map((user) => {
          if (user.id !== data.user.id) return user;
          return { ...user, isOnline: data.status };
        });
      });
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await chatApi.getUsers({ search: debouncedSearch });
        setUsers(res);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [debouncedSearch]);

  useEffect(() => {
    const unsubscribe = subscribeToMessage(handleMessage);

    return () => {
      unsubscribe();
    };
  }, [handleMessage]);

  return {
    users,
    isLoading,
    search,
    setSearch,
  };
};
