'use client';

import { theme } from '@/configs/themeConfig';
import { MantineProvider } from '@mantine/core';
import { PropsWithChildren } from 'react';

export const MantineClientProvider = ({ children }: PropsWithChildren) => {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
};
