import { TUserModel } from './models';

export type TUserItem = TUserModel & {
  isOnline?: boolean;
};
