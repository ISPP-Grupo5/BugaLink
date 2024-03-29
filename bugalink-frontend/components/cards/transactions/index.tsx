import Avatar from '@/components/avatar';
import useLastTransactions from '@/hooks/useLastTransactions';
import LastTransactionsI from '@/interfaces/lastTransactions';
import UserI from '@/interfaces/user';
import { parseDateFromDate, shortenName } from '@/utils/formatters';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';

//Transactions list
export default function TransactionList() {
  const { data } = useSession();
  const me = data?.user as User;
  const { lastTransactions } = useLastTransactions();
  //Logged user is receiver?

  const isReceiver = (transaction: LastTransactionsI) => (transaction.receiver?.id == me.user_id);
  const isPending = (transaction: LastTransactionsI) => (transaction.status === 'PENDING');
  const isRejected = (transaction: LastTransactionsI) => (transaction.status === 'DECLINED');
  const isRecharged = (transaction: LastTransactionsI) => (transaction.status === 'RECHARGE');

  return (
    <div className="divide-y-2 divide-light-gray overflow-y-scroll bg-white">
      {lastTransactions?.map((transaction: LastTransactionsI) => {
        //By default the user is the driver. aka: receiver
        let color = 'text-green',
          sign = '+',
          type = 'Pasajero',
          notMe = transaction.sender;
        const pending = isPending(transaction);
        const rejected = isRejected(transaction);
        const imReceiver = isReceiver(transaction);
        const isRecharge = isRecharged(transaction);
        const isWithdraw = transaction.receiver === null;

        const date = parseDateFromDate(transaction.date);
        const amount = Number.parseFloat(transaction.amount).toLocaleString(
          'es-ES',
          {
            style: 'currency',
            currency: 'EUR',
          }
        );
        if (!imReceiver) {
          color = 'text-red';
          sign = '-';
          type = 'Conductor';
          notMe = transaction.receiver;
        }
        if (rejected) color = "text-gray";
        if (pending) color = "text-yellow";
        if (isWithdraw) {
          color = 'text-red';
          sign = '-';
          type = '';
        }
        if (isRecharge) {
          type = '';
        }

        return (
          <Transaction
            key={transaction.id}
            notMe={notMe}
            travelType={type}
            //TO-DO: change to the date of the transaction
            date={date}
            className={color}
            money={sign + amount}
            isPending={pending}
            isRejected={rejected}
            isWithdraw={isWithdraw}
            isRecharge={isRecharge}
          />
        );
      })}
    </div>
  );
}

//Single transaction
type Params = {
  notMe: UserI;
  travelType?: string;
  date: string;
  className: string;
  money: string;
  isPending?: boolean;
  isRejected?: boolean;
  isWithdraw?: boolean;
  isRecharge?: boolean;
};

export function Transaction({
  notMe,
  travelType,
  date,
  className,
  money,
  isPending = false,
  isRejected = false,
  isWithdraw = false,
  isRecharge = false,
}: Params) {
  // Using constant in senderName was causing problems, so I changed it to let before the if
  let senderName: string;
  if (isWithdraw) {
    senderName = 'Retirada de saldo';
  } else if (isRecharge) {
    senderName = 'Recarga de saldo';
  } else {
    senderName = shortenName(notMe.first_name, notMe.last_name);
  }

  return (
    <div className="flex items-center justify-between space-x-4 p-4">
      <div className="flex space-x-4 truncate">
        <Avatar
          src={isWithdraw || isRecharge ? '/assets/bank.png' : notMe.photo}
          className="h-14 w-14 place-self-center"
        />
        <div className="flex flex-col justify-center truncate">
          <p className="truncate text-lg font-bold text-black">
            {/*I did in ternary operation inside of a ternary operation but sonar did not like that*/}
            {senderName}
          </p>
          <p className="text-base text-gray">
            {travelType} - {date}
          </p>
        </div>
      </div>

      <div className="flex-none text-right">
        <p className={'text-lg font-bold ' + className}>{money}</p>
        {!isWithdraw && isPending && <p className={'text-base ' + className}>Pendiente</p>}
        {isRejected && <p className={'text-base ' + className}>Rechazado</p>}

      </div>
    </div>
  );
}
