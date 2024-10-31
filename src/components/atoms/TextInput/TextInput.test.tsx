import { MantineClientProvider } from '@/providers/MantineClientProvider';
import { render } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { TextInput } from './TextInput';

describe('TextInput', () => {
  const getComponent = () => <TextInput />;

  it('render without crash', () => {
    render(getComponent(), {
      wrapper: ({ children }: PropsWithChildren) => {
        return <MantineClientProvider>{children}</MantineClientProvider>;
      },
    });
  });
});
