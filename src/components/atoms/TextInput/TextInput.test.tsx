import { MantineClientProvider } from '@/providers/MantineClientProvider';
import { TextInputProps } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { TextInput } from './TextInput';

describe('TextInput', () => {
  const renderComponent = (props: TextInputProps = { onChange: () => {} }) => {
    render(<TextInput data-testid="text-input" {...props} />, {
      wrapper: ({ children }: PropsWithChildren) => {
        return <MantineClientProvider>{children}</MantineClientProvider>;
      },
    });
  };

  it('should render correctly', async () => {
    renderComponent();

    expect(screen.getByTestId('text-input')).toBeInTheDocument();
  });
});
