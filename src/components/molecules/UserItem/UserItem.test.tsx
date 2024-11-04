import { render, screen } from '@testing-library/react';
import { UserItem } from './UserItem';

describe('UserItem', () => {
  const renderComponent = ({
    username = 'John Doe',
    isOnline = false,
  }: {
    username?: string;
    isOnline?: boolean;
  } = {}) => {
    render(<UserItem username={username} isOnline={isOnline} />);
  };

  it('should render correctly when isOnline is true', async () => {
    renderComponent({ isOnline: true });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  it('should render correctly when isOnline is false', async () => {
    renderComponent({ isOnline: false });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Online')).toBeNull();
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });
});
