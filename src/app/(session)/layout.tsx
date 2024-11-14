import { getSession } from '@/helpers/getSession';
import { SessionClientProvider } from '@/providers/SessionClientProvider';
import { WebsocketProvider } from '@/providers/WebsocketProvider';
import { PropsWithChildren } from 'react';

export default async function SessionLayout({ children }: PropsWithChildren) {
  const session = await getSession();

  return (
    <SessionClientProvider session={session}>
      <WebsocketProvider>{children}</WebsocketProvider>
    </SessionClientProvider>
  );
}
