'use client';

import { EmptyMessage } from '@/components/atoms/EmptyMessage';
import { Loader } from '@/components/atoms/Loader';
import { SearchInput } from '@/components/atoms/SearchInput';
import { UserItem } from '@/components/molecules/UserItem';
import { useUsers } from '@/hooks/useUsers';
import { useWebsocket } from '@/providers/WebsocketProvider';
import { TUserModel } from '@/types/models';
import { UsersIcon } from '@heroicons/react/24/outline';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import styles from './UsersPanel.module.scss';

export const UsersPanel = () => {
  const { users, isLoading, search, setSearch } = useUsers();
  const { subscribeUserUpdates, unsubscribeUserUpdates } = useWebsocket();
  const params = useParams();
  const router = useRouter();

  const userId = params?.userId;
  const userIds = useMemo(() => {
    if (!users.length) {
      return [];
    }

    return users.map((user) => user.id);
  }, [users]);

  const handleUserClick = (user: TUserModel) => () => {
    router.push(`/chat/private/${user.id}`);
  };

  useEffect(() => {
    subscribeUserUpdates(userIds);

    return () => {
      unsubscribeUserUpdates(userIds);
    };
  }, [subscribeUserUpdates, userIds]);

  return (
    <div className={styles.users_panel}>
      <div className={styles.header}>
        <SearchInput
          placeholder="Search by username"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.loader}>
            <Loader size="md" />
          </div>
        ) : users.length === 0 ? (
          <EmptyMessage>
            <UsersIcon width={50} height={50} />
            <span>No users found</span>
          </EmptyMessage>
        ) : (
          users.map((user) => (
            <UserItem
              key={user.id}
              username={user.username}
              isOnline={user.isOnline}
              onClick={handleUserClick(user)}
            />
          ))
        )}
      </div>
    </div>
  );
};
