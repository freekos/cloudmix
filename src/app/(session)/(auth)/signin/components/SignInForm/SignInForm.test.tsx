import { MantineClientProvider } from '@/providers/MantineClientProvider';
import { render, screen } from '@testing-library/react';
import { signIn } from 'next-auth/react';
import { PropsWithChildren } from 'react';
import { SignInForm } from './SignInForm';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

describe('SignInForm', () => {
  const signInMock = signIn as jest.Mock;

  const renderComponent = () => {
    render(<SignInForm />, {
      wrapper: ({ children }: PropsWithChildren) => (
        <MantineClientProvider>{children}</MantineClientProvider>
      ),
    });
  };

  it('should render correctly', () => {
    renderComponent();

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });
});
