import { MantineClientProvider } from '@/providers/MantineClientProvider';
import { render, screen } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { SignUpForm } from './SignUpForm';

jest.mock('@/services/api/auth', () => ({
  authApi: {
    register: jest.fn(),
  },
}));
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('SignUpForm', () => {
  const renderComponent = () => {
    render(<SignUpForm />, {
      wrapper: ({ children }: PropsWithChildren) => (
        <MantineClientProvider>{children}</MantineClientProvider>
      ),
    });
  };

  it('should render correctly', () => {
    renderComponent();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Register' }),
    ).toBeInTheDocument();
  });
});
