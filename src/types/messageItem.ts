import { TMessageModel } from './models';
import { TTemporaryMessage } from './temporaryMessage';

export type TMessageItem = TMessageModel | TTemporaryMessage;
