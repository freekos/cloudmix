import styles from './page.module.scss';

export default async function ChatPage() {
  return (
    <div className={styles.chat_page}>
      Select user or bot and start chatting
    </div>
  );
}
