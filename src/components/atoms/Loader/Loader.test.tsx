import { MantineClientProvider } from '@/providers/MantineClientProvider';
import { render } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { Loader } from './Loader';

describe('Loader', () => {
  const getComponent = () => <Loader />;

  it('render without crash', () => {
    render(getComponent(), {
      wrapper: ({ children }: PropsWithChildren) => {
        return <MantineClientProvider>{children}</MantineClientProvider>;
      },
    });
  });
});
