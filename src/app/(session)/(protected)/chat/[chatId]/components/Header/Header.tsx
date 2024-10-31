import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import styles from './Header.module.scss';

export function Header() {
  const router = useRouter();
  const matches = useMediaQuery('(max-width: 500px)');

  return (
    <header className={styles.header}>
      {matches && (
        <div className={styles.left}>
          <button className={styles.back} onClick={() => router.back()}>
            <ChevronLeftIcon width={20} height={20} />
          </button>
        </div>
      )}
      <div className={styles.right}>
        <span className={styles.username}>Aslan</span>
        <span className={styles.status}>Online</span>
      </div>
    </header>
  );
}
