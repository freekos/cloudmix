import { MantineClientProvider } from '@/providers/MantineClientProvider';
import { render, screen } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { Button, ButtonProps } from './Button';

describe('Button', () => {
  const getComponent = (props: ButtonProps = {}) => <Button {...props} />;

  it('renders without crashing', () => {
    render(getComponent(), {
      wrapper: ({ children }: PropsWithChildren) => {
        return <MantineClientProvider>{children}</MantineClientProvider>;
      },
    });

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders children', () => {
    const children = 'Hello world';
    render(getComponent({ children }), {
      wrapper: ({ children }: PropsWithChildren) => {
        return <MantineClientProvider>{children}</MantineClientProvider>;
      },
    });

    expect(screen.getByText(children)).toBeInTheDocument();
  });

  it('renders with className', () => {
    const className = 'test-class';
    render(getComponent({ className }), {
      wrapper: ({ children }: PropsWithChildren) => {
        return <MantineClientProvider>{children}</MantineClientProvider>;
      },
    });

    expect(screen.getByRole('button')).toHaveClass(className);
  });

  it('renders with type', () => {
    const type = 'submit';
    render(getComponent({ type }), {
      wrapper: ({ children }: PropsWithChildren) => {
        return <MantineClientProvider>{children}</MantineClientProvider>;
      },
    });

    expect(screen.getByRole('button')).toHaveAttribute('type', type);
  });

  it('renders with disabled', () => {
    const disabled = true;
    render(getComponent({ disabled }), {
      wrapper: ({ children }: PropsWithChildren) => {
        return <MantineClientProvider>{children}</MantineClientProvider>;
      },
    });

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders with loading', () => {
    const loading = true;
    render(getComponent({ loading }), {
      wrapper: ({ children }: PropsWithChildren) => {
        return <MantineClientProvider>{children}</MantineClientProvider>;
      },
    });

    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('renders with click handler', () => {
    const onClick = jest.fn();
    render(getComponent({ onClick }), {
      wrapper: ({ children }: PropsWithChildren) => {
        return <MantineClientProvider>{children}</MantineClientProvider>;
      },
    });

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    button.click();
    expect(onClick).toHaveBeenCalled();
  });
});
