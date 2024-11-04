import { TMessageItem } from './messageItem';
import { TChatModel } from './models';

export type TChatItem = Omit<TChatModel, 'messages'> & {
  isTyping?: boolean;
  messages: TMessageItem[];
};
