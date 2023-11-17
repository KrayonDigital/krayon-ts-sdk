import { Pageable } from './pagination';

export enum DepositStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  UNKNOWN = 'UNKNOWN',
}

export const DepositStatusName = new Map([
  [DepositStatus.ERROR, 'Error'],
  [DepositStatus.SUCCESS, 'Success'],
  [DepositStatus.UNKNOWN, 'Unknown'],
]);

export interface MerchantDeposit {
  id: string;
  name: string;
  currency: string;
  logo: string;
  created_at: string;
  gross_payment: string;
  payment_fee: string;
  amount: string;
  symbol: string;
  type: string;
}

export interface MerchantNotificationDeposit {
  id: string;
  organization: string;
  wallet: string;
  status: string;
  amount: number;
  currency: string;
  symbol: string;
  webhook_url: string;
  type: string;
}

export interface MerchantNotification {
  id: string;
  created_at: string;
  delivery_status: DepositStatus;
  delivery_error_message: string;
  related_object_details: MerchantNotificationDeposit | any;
}

export const getMerchantStatusColor = (status?: string) => {
  const statusColor = { bg: 'bg-red/10', text: 'text-red' };

  switch (status) {
    case DepositStatus.UNKNOWN:
      statusColor.bg = 'bg-blue/10';
      statusColor.text = 'text-blue';
      break;

    case DepositStatus.SUCCESS:
      statusColor.bg = 'bg-green/10';
      statusColor.text = 'text-green';
      break;

    default:
      statusColor.bg = 'bg-red/10';
      statusColor.text = 'text-red';
      break;
  }
  return statusColor;
};

export type MerchantDepositsResponse = Pageable<MerchantDeposit>;
export type MerchantNotificationResponse = Pageable<MerchantNotification>;
