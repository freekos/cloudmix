export enum ChatGatewayAction {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  SEND_TYPING = 'sendTyping',
  SEND_PRIVATE_MESSAGE = 'sendPrivateMessage',
  SEND_MESSAGE = 'sendMessage',
  // UPDATE_MESSAGE = 'updateMessage',
  // DELETE_MESSAGE = 'deleteMessage',
  SUBSCRIBE_USER_UPDATES = 'subscribeUserUpdates',
  UNSUBSCRIBE_USER_UPDATES = 'unsubscribeUserUpdates',
  UPDATE_MESSAGE_RECEIPT = 'updateMessageReceipt',
}
export enum ChatGatewayTopic {
  TYPING = 'typing',
  RECEIVED_MESSAGE = 'receivedMessage',
  SENT_MESSAGE = 'sentMessage',
  UPDATED_USER = 'updatedUser',
  UPDATED_MESSAGE_RECEIPT = 'updatedMessageReceipt',
}
