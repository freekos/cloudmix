import { SendIcon } from '@/components/atoms/Icons/SendIcon';
import { useWebsocket } from '@/providers/WebsocketProvider';
import clsx from 'clsx';
import {
  ChangeEvent,
  ComponentPropsWithoutRef,
  KeyboardEvent,
  useEffect,
  useState,
} from 'react';
import styles from './Input.module.scss';

interface InputProps extends ComponentPropsWithoutRef<'div'> {
  isDisabled: boolean;
  chatId: string | undefined;
  onSend: (message: string) => void;
}

export const Input = ({
  className,
  chatId,
  isDisabled,
  onSend,
  ...props
}: InputProps) => {
  const [message, setMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean | undefined>(undefined);
  const { sendTyping } = useWebsocket();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);

    setIsTyping(true);
  };

  const handleBlur = () => {
    setIsTyping(false);
  };

  const handleSend = () => {
    if (message.trim() === '') {
      return;
    }

    onSend(message);
    setMessage('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSend();
    }
  };

  useEffect(() => {
    if (!chatId || isTyping === undefined) {
      return;
    }

    sendTyping(chatId, isTyping);
  }, [chatId, isTyping]);

  return (
    <div className={clsx(styles.input, className)} {...props}>
      <input
        className={styles.textarea}
        placeholder="Write a message..."
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        disabled={isDisabled}
      />
      <button
        className={styles.send}
        disabled={isDisabled}
        onClick={handleSend}
      >
        <SendIcon width={24} height={24} />
      </button>
    </div>
  );
};
