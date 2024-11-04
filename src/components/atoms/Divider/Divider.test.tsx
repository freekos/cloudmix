import { MantineClientProvider } from '@/providers/MantineClientProvider';
import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { Divider } from './Divider';

describe('Divider', () => {
  const renderComponent = () => {
    render(<Divider data-testid="divider" />, {
      wrapper: ({ children }: PropsWithChildren) => {
        return <MantineClientProvider>{children}</MantineClientProvider>;
      },
    });
  };

  it('should render correctly', async () => {
    renderComponent();

    expect(screen.getByTestId('divider')).toBeInTheDocument();
  });
});
