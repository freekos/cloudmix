import { MantineClientProvider } from '@/providers/MantineClientProvider';
import { PasswordInputProps } from '@mantine/core';
import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { PasswordInput } from './PasswordInput';

describe('PasswordInput', () => {
  const renderComponent = (
    {
      label = 'Password',
      placeholder = 'Enter password',
      value = 'password',
      error = 'Invalid password',
      ...props
    }: PasswordInputProps = { onChange: () => {} },
  ) => {
    render(
      <PasswordInput
        {...props}
        label={label}
        placeholder={placeholder}
        value={value}
        error={error}
      />,
      {
        wrapper: ({ children }: PropsWithChildren) => {
          return <MantineClientProvider>{children}</MantineClientProvider>;
        },
      },
    );
  };

  it('should render correctly', async () => {
    renderComponent();

    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
    expect(screen.getByDisplayValue('password')).toBeInTheDocument();
    expect(screen.getByText('Invalid password')).toBeInTheDocument();
  });
});
