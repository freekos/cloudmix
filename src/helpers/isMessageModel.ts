import { TMessageItem } from '@/types/messageItem';
import { TMessageModel } from '@/types/models';

export function isMessageModel(
  message: TMessageItem,
): message is TMessageModel {
  return (message as TMessageModel).receipts !== undefined;
}
