import { z } from 'zod';
import { MessageStatus } from '../../constants/messageStatus';
import { OrderBy } from '../../constants/orderBy';

export const getMessagesDto = z.object({
  search: z.string().optional(),
  status: z.nativeEnum(MessageStatus).optional(),
  orderBy: z.nativeEnum(OrderBy).optional(),
});
