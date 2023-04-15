import { User } from "next-auth";

type LastTransactionsI = {
    id: number;
    sender: User;
    receiver: User;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
    is_refund : boolean;
    amount: string;
}

export default LastTransactionsI;