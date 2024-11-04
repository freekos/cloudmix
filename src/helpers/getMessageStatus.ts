import { MessageStatus } from '@/constants/messageStatus';
import { TMessageModel } from '@/types/models';
import { TTemporaryMessage } from '@/types/temporaryMessage';
import { isMessageModel } from './isMessageModel';

export function getMessageStatus(
  message: TMessageModel | TTemporaryMessage,
): MessageStatus {
  if (
    !isMessageModel(message) ||
    !message.receipts ||
    message.receipts.length === 0
  ) {
    return MessageStatus.PENDING;
  }

  const readReceipt = message.receipts.find(
    (receipt) => receipt.status === MessageStatus.READ,
  );
  if (readReceipt) {
    return MessageStatus.READ;
  }

  const deliveredReceipt = message.receipts.find(
    (receipt) => receipt.status === MessageStatus.DELIVERED,
  );
  if (deliveredReceipt) {
    return MessageStatus.DELIVERED;
  }

  const sentReceipt = message.receipts.find(
    (receipt) => receipt.status === MessageStatus.SENT,
  );
  if (sentReceipt) {
    return MessageStatus.SENT;
  }

  return MessageStatus.PENDING;
}
