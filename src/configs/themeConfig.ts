import { DividerExtend } from '@/components/atoms/Divider';
import { LoaderExtend } from '@/components/atoms/Loader';
import { PasswordInputExtend } from '@/components/atoms/PasswordInput';
import { SkeletonExtend } from '@/components/atoms/Skeleton';
import { TabsExtend } from '@/components/atoms/Tabs';
import { TextInputExtend } from '@/components/atoms/TextInput';
import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'primary',
  colors: {
    primary: [
      '#9969FF',
      '#9969FF',
      '#9969FF',
      '#9969FF',
      '#9969FF',
      '#9969FF',
      '#9969FF',
      '#9969FF',
      '#9969FF',
      '#9969FF',
    ],
  },
  components: {
    Loader: LoaderExtend,
    TextInput: TextInputExtend,
    PasswordInput: PasswordInputExtend,
    Divider: DividerExtend,
    Skeleton: SkeletonExtend,
    Tabs: TabsExtend,
  },
});
