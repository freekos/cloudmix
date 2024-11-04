import { MessageStatus } from '@/constants/messageStatus';
import { TMessageModel } from '@/types/models';
import { render, screen } from '@testing-library/react';
import { ChatItem } from './ChatItem';

describe('ChatItem', () => {
  const renderComponent = ({
    isMine = false,
    userNames = ['John Doe'],
    message = {
      content: 'Hello, world!',
      createdAt: '2023-01-01T01:00:00.000Z',
    },
    messagesCount = 0,
    status = undefined,
    isActive = false,
    isTyping = false,
  }: {
    isMine?: boolean;
    userNames?: string[];
    message?: Pick<TMessageModel, 'content' | 'createdAt'>;
    messagesCount?: number;
    status?: MessageStatus;
    isActive?: boolean;
    isTyping?: boolean;
  } = {}) => {
    render(
      <ChatItem
        isMine={isMine}
        userNames={userNames}
        message={message}
        messagesCount={messagesCount}
        status={status}
        isActive={isActive}
        isTyping={isTyping}
      />,
    );
  };

  it('should render correctly when isTyping is true and all props are defined', async () => {
    renderComponent({
      isMine: true,
      isTyping: true,
      status: MessageStatus.PENDING,
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Sending...')).toBeNull();
    expect(screen.queryByTestId('messages_count')).toBeNull();
    expect(screen.queryByText('Hello, world!')).toBeNull();
    expect(screen.queryByText('07:00')).toBeNull();
  });

  it('should render correctly when isMine is true and status is undefined', async () => {
    renderComponent({
      isMine: true,
      isTyping: false,
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.queryByTestId('messages_count')).toBeNull();
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    expect(screen.getByText('07:00')).toBeInTheDocument();
  });

  it('should render correctly when isMine is true and status is pending', async () => {
    renderComponent({
      isMine: true,
      isTyping: false,
      status: MessageStatus.PENDING,
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Sending...')).toBeInTheDocument();
    expect(screen.queryByTestId('messages_count')).toBeNull();
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    expect(screen.getByText('07:00')).toBeInTheDocument();
  });

  it('should render correctly when isMine is true and status is sent', async () => {
    renderComponent({
      isMine: true,
      isTyping: false,
      status: MessageStatus.SENT,
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Sent')).toBeInTheDocument();
    expect(screen.queryByTestId('messages_count')).toBeNull();
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    expect(screen.getByText('07:00')).toBeInTheDocument();
  });

  it('should render correctly when isMine is true and status is delivered', async () => {
    renderComponent({
      isMine: true,
      isTyping: false,
      status: MessageStatus.DELIVERED,
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Delivered')).toBeInTheDocument();
    expect(screen.queryByTestId('messages_count')).toBeNull();
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    expect(screen.getByText('07:00')).toBeInTheDocument();
  });

  it('should render correctly when isMine is true and status is read', async () => {
    renderComponent({
      isMine: true,
      isTyping: false,
      status: MessageStatus.READ,
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Read')).toBeInTheDocument();
    expect(screen.queryByTestId('messages_count')).toBeNull();
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    expect(screen.getByText('07:00')).toBeInTheDocument();
  });

  it('should render correctly when isMine is false and status is undefined and messagesCount is 0', async () => {
    renderComponent({
      isMine: false,
      status: undefined,
      messagesCount: 0,
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByTestId('status')).toBeNull();
    expect(screen.queryByTestId('messages_count')).toBeNull();
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    expect(screen.getByText('07:00')).toBeInTheDocument();
  });

  it('should render correctly when isMine is false and status is undefined and messagesCount is not 0', async () => {
    renderComponent({
      isMine: false,
      status: undefined,
      messagesCount: 1,
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByTestId('status')).toBeNull();
    expect(screen.getByTestId('messages_count')).toHaveTextContent('1');
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    expect(screen.getByText('07:00')).toBeInTheDocument();
  });
});
