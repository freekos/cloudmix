import { MantineClientProvider } from '@/providers/MantineClientProvider';
import { render, screen } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { Button, ButtonProps } from './Button';

describe('Button', () => {
  const renderComponent = (props: ButtonProps = {}) => {
    render(<Button {...props} />, {
      wrapper: ({ children }: PropsWithChildren) => {
        return <MantineClientProvider>{children}</MantineClientProvider>;
      },
    });
  };

  it('should render correctly', async () => {
    renderComponent();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render correctly with children', async () => {
    renderComponent({
      children: 'Hello, world!',
    });

    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });

  it('should render correctly with className', async () => {
    renderComponent({
      className: 'test-class',
    });

    expect(screen.getByRole('button')).toHaveClass('test-class');
  });

  it('should render correctly with type', async () => {
    renderComponent({
      type: 'submit',
    });

    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('should render correctly with disabled is true', async () => {
    renderComponent({
      disabled: true,
    });

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should render correctly with loading is true', async () => {
    renderComponent({
      loading: true,
    });

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should render correctly with loading is true and children', async () => {
    renderComponent({
      loading: true,
      children: 'Hello, world!',
    });

    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.queryByText('Hello, world!')).toBeNull();
  });

  it('renders with click handler', async () => {
    const onClick = jest.fn();

    renderComponent({
      onClick,
    });

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    button.click();
    expect(onClick).toHaveBeenCalled();
  });
});
