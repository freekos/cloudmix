import { MessageStatus } from '@/constants/messageStatus';
import { render, screen } from '@testing-library/react';
import { MessageItem } from './MessageItem';

describe('MessageItem', () => {
  const renderComponent = ({
    isMine = false,
    content = 'Hello, world!',
    createdAt = '2023-01-01T01:00:00.000Z',
    status = undefined,
  }: {
    content?: string;
    createdAt?: string;
    isMine?: boolean;
    status?: MessageStatus;
  } = {}) => {
    render(
      <MessageItem
        content={content}
        createdAt={createdAt}
        isMine={isMine}
        status={status}
      />,
    );
  };

  it('should render correctly when isMine is false and status is undefined', async () => {
    renderComponent({ isMine: false });

    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    expect(screen.getByText('07:00')).toBeInTheDocument();
    expect(screen.queryByText('Sending...')).toBeNull();
  });

  it('should render correctly when isMine is true and status is undefined', async () => {
    renderComponent({ isMine: true });

    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    expect(screen.getByText('07:00')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  it('should render correctly when isMine is true and status is pending', async () => {
    renderComponent({ isMine: true, status: MessageStatus.PENDING });

    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    expect(screen.getByText('07:00')).toBeInTheDocument();
    expect(screen.getByText('Sending...')).toBeInTheDocument();
  });

  it('should render correctly when isMine is true and status is sent', async () => {
    renderComponent({ isMine: true, status: MessageStatus.SENT });

    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    expect(screen.getByText('07:00')).toBeInTheDocument();
    expect(screen.getByText('Sent')).toBeInTheDocument();
  });

  it('should render correctly when isMine is true and status is delivered', async () => {
    renderComponent({ isMine: true, status: MessageStatus.DELIVERED });

    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    expect(screen.getByText('07:00')).toBeInTheDocument();
    expect(screen.getByText('Delivered')).toBeInTheDocument();
  });

  it('should render correctly when isMine is true and status is read', async () => {
    renderComponent({ isMine: true, status: MessageStatus.READ });

    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    expect(screen.getByText('07:00')).toBeInTheDocument();
    expect(screen.getByText('Read')).toBeInTheDocument();
  });

  it('should render correctly when isMine is false and status is defined', async () => {
    renderComponent({ isMine: false, status: MessageStatus.PENDING });

    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    expect(screen.getByText('07:00')).toBeInTheDocument();
    expect(screen.queryByText('Sending...')).toBeNull();
  });
});
