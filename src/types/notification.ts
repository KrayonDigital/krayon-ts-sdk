import { NotificationType } from 'shared/consts/enums';

export interface Notification {
  text: string;
  type: NotificationType;
  id: number;
}
