import useLastTransactions from "@/hooks/useLastTransactions";
import LastTransactionsI from "@/interfaces/lastTransactions";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

//Transactions list
export function TransactionList() {
  const { lastTransactions } = useLastTransactions();
  const { data } = useSession();
  const me = data?.user as User;
  const isReceiver = (transaction: LastTransactionsI) => (transaction.receiver.user_id === me.user_id);
  const isPending = (transaction: LastTransactionsI) => (transaction.status === 'PENDING');
  
  return (
    <div className="divide-y-2 divide-light-gray overflow-y-scroll bg-white">
      { lastTransactions?.map((transaction: LastTransactionsI) => {
        //By default the user is the driver. aka: receiver
        var color = "text-green",
            sign = "+",
            type = "Pasajero",
            notMe = transaction.sender;
        const pending = isPending(transaction);
        const imReceiver = isReceiver(transaction);
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

        if (pending) color="text-yellow";

        return (
          <Transaction
            notMe={notMe}
            travelType={type}
            //TO-DO: change to the date of the transaction
            date={"8 Marzo"}
            className={color}
            money={sign + amount}
            isPending={pending}
          />
        );
      })}
    </div>
  );
}

//Single transaction
type Params = {
  notMe: User;
  travelType?: string;
  date: string;
  className: string;
  money: string;
  isPending?: boolean;
};

export function Transaction({
  notMe,
  travelType,
  date,
  className,
  money,
  isPending = false,
}: Params) {

  const completeName= notMe.first_name + " " + notMe.last_name;
  const icon= notMe.photo? notMe.photo: "/icons/Vista-Principal/hombre.png";

  return (
    <div className="grid grid-cols-4 place-content-center justify-between space-x-2">
      <div className="col-span-1 mx-auto flex scale-90 flex-row -space-x-16">
        <img src={icon} className="z-10 h-20 w-20 scale-75 object-scale-down" />
      </div>

      <div className="col-span-2 text-ellipsis py-4">
        <p className=" text-lg font-bold text-black">{completeName}</p>
        <p className="text-base text-gray">
          {travelType} - {date}
        </p>
      </div>

      <div className="col-span-1 my-auto mx-auto pr-3 text-right ">
        <p className={'text-lg font-bold ' + className}>{money}</p>
        {isPending && <p className="text-base text-yellow">Pendiente</p>}
      </div>
    </div>
  );
}

export default [ Transaction ];
