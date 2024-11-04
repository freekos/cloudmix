import { TMessageModel } from './models';

export type TTemporaryMessage = Pick<
  TMessageModel,
  'id' | 'createdAt' | 'content' | 'senderId'
>;
