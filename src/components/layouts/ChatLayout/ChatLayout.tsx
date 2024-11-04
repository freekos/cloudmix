'use client';

import { TUserModel } from '@/types/models';
import clsx from 'clsx';
import { ComponentPropsWithoutRef } from 'react';
import styles from './ChatLayout.module.scss';
import { Header } from './components/Header';
import { Input } from './components/Input';

interface ChatLayoutProps extends ComponentPropsWithoutRef<'div'> {
  isInputDisabled: boolean;
  users: TUserModel[];
  chatId: string | undefined;
  onSend: (message: string) => void;
}

export const ChatLayout = ({
  children,
  className,
  isInputDisabled,
  users,
  chatId,
  onSend,
  ...props
}: ChatLayoutProps) => {
  return (
    <div className={clsx(styles.chat_layout, className)} {...props}>
      <Header users={users} />
      <div className={styles.content}>{children}</div>
      <Input chatId={chatId} onSend={onSend} isDisabled={isInputDisabled} />
    </div>
  );
};
