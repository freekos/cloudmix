import { MantineClientProvider } from '@/providers/MantineClientProvider';
import { LoaderProps } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { Loader } from './Loader';

describe('Loader', () => {
  const renderComponent = (props: LoaderProps = {}) => {
    render(<Loader data-testid="loader" {...props} />, {
      wrapper: ({ children }: PropsWithChildren) => {
        return <MantineClientProvider>{children}</MantineClientProvider>;
      },
    });
  };

  it('should render correctly', async () => {
    renderComponent();

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });
});
