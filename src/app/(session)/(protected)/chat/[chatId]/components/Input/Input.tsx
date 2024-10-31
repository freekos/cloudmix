import { SendIcon } from '@/components/atoms/Icons/SendIcon';
import { ChangeEvent, useState } from 'react';
import styles from './Input.module.scss';

export const Input = () => {
  const [message, setMessage] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  return (
    <div className={styles.input}>
      <input
        className={styles.textarea}
        placeholder="Write a message..."
        value={message}
        onChange={handleChange}
      />
      <button className={styles.send}>
        <SendIcon width={24} height={24} />
      </button>
    </div>
  );
};
