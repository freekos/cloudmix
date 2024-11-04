import { render, screen } from '@testing-library/react';
import { EmptyMessage, EmptyMessageProps } from './EmptyMessage';

describe('EmptyMessage', () => {
  const renderComponent = ({
    children = 'No messages found',
    ...props
  }: EmptyMessageProps = {}) => {
    render(<EmptyMessage {...props}>{children}</EmptyMessage>);
  };

  it('should render correctly', async () => {
    renderComponent();

    expect(screen.getByText('No messages found')).toBeInTheDocument();
  });
});
