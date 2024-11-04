import { MantineClientProvider } from '@/providers/MantineClientProvider';
import { TabsProps } from '@mantine/core';
import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { Tabs } from './Tabs';

describe('Tabs', () => {
  const renderComponent = (props: TabsProps = {}) => {
    render(<Tabs data-testid="tabs" {...props} />, {
      wrapper: ({ children }: PropsWithChildren) => {
        return <MantineClientProvider>{children}</MantineClientProvider>;
      },
    });
  };

  it('should render correctly', async () => {
    renderComponent();

    expect(screen.getByTestId('tabs')).toBeInTheDocument();
  });
});
