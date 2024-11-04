import { MantineClientProvider } from '@/providers/MantineClientProvider';
import { QueryClientProvider } from '@/providers/QueryClientProvider';
import '@/styles/globals.scss';
import { ColorSchemeScript } from '@mantine/core';
import '@mantine/core/styles.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Cloud Mix',
  description: 'Chat with your favourite AI assistants',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-mantine-color-scheme="light">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.variable}>
        <QueryClientProvider>
          <MantineClientProvider>{children}</MantineClientProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
