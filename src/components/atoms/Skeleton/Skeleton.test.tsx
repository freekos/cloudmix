import { MantineClientProvider } from '@/providers/MantineClientProvider';
import { SkeletonProps } from '@mantine/core';
import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  const renderComponent = (props: SkeletonProps = {}) => {
    render(<Skeleton data-testid="skeleton" {...props} />, {
      wrapper: ({ children }: PropsWithChildren) => {
        return <MantineClientProvider>{children}</MantineClientProvider>;
      },
    });
  };

  it('should render correctly', async () => {
    renderComponent();

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });
});
