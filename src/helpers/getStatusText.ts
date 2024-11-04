import { MessageStatus } from '@/constants/messageStatus';

export function getStatusText(status?: MessageStatus) {
  if (status === MessageStatus.PENDING) {
    return 'Sending...';
  }
  if (status === MessageStatus.SENT) {
    return 'Sent';
  }
  if (status === MessageStatus.DELIVERED) {
    return 'Delivered';
  }
  if (status === MessageStatus.READ) {
    return 'Read';
  }

  return 'Failed';
}
