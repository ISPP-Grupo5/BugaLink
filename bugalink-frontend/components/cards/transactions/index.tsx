import useLastTransactions from "@/hooks/useLastTransactions";
import LastTransactionsI from "@/interfaces/lastTransactions";
import UserI from "@/interfaces/user";
import { parseDateFromDate, shortenName } from "@/utils/formatters";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

//Transactions list
export function TransactionList() {
  const { data } = useSession();
  const me = data?.user as User;
  const { lastTransactions } = useLastTransactions();
  //Logged user is receiver?
  const isReceiver = (transaction: LastTransactionsI) => (transaction.receiver.id == me.user_id);
  const isPending = (transaction: LastTransactionsI) => (transaction.status === 'PENDING');
  const isRejected = (transaction: LastTransactionsI) => (transaction.status === 'DECLINED');
  
  return (
    <div className="divide-y-2 divide-light-gray overflow-y-scroll bg-white">
      { lastTransactions?.map((transaction: LastTransactionsI) => {
        //By default the user is the driver. aka: receiver
        let color = "text-green",
        sign = "+",
        type = "Pasajero",
        notMe = transaction.sender;
        const pending = isPending(transaction);
        const rejected = isRejected(transaction);
        const imReceiver = isReceiver(transaction);
        
        const date = parseDateFromDate(transaction.date);
        const amount = Number.parseFloat(transaction.amount).toLocaleString(
          "es-ES",
          {
            style: "currency",
            currency: "EUR",
          }
          );

        if (!imReceiver) {
          color = "text-red";
          sign = "-";
          type = "Conductor";
          notMe = transaction.receiver;
        }
        if (rejected) color = "text-gray";
        if (pending) color= "text-yellow";

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
};

export function Transaction({
  notMe,
  travelType,
  date,
  className,
  money,
  isPending = false,
  isRejected = false,
}: Params) {

  const icon= notMe.photo? notMe.photo: "/icons/Vista-Principal/hombre.png";

  return (
    <div className="grid grid-cols-4 place-content-center justify-between space-x-2">
      <div className="col-span-1 mx-auto flex scale-90 flex-row -space-x-16">
        <img src={icon} className="z-10 h-20 w-20 scale-75 object-scale-down" />
      </div>

      <div className="col-span-2 text-ellipsis py-4">
        <p className=" text-lg font-bold text-black">{shortenName(notMe.first_name, notMe.last_name)}</p>
        <p className="text-base text-gray">
          {travelType} - {date}
        </p>
      </div>

      <div className="col-span-1 my-auto mx-auto pr-3 text-right ">
        <p className={'text-lg font-bold ' + className}>{money}</p>
        {isPending && <p className={'text-base ' + className}>Pendiente</p>}
        {isRejected && <p className={'text-base ' + className}>Rechazado</p>}
        
      </div>
    </div>
  );
}

export default [ TransactionList ];
