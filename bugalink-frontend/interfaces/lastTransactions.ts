import UserI from './user';

type LastTransactionsI = {
  id: number;
  sender: UserI;
  receiver?: UserI;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  is_refund: boolean;
  amount: string;
  date: string;
};

export default LastTransactionsI;
