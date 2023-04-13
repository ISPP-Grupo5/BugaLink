import { BackButtonText } from '@/components/buttons/Back';
import AnimatedLayout from '@/components/layouts/animated';
import BugalinkLogo from '/public/assets/bugalink.svg';
import VisaMastercard from '/public/assets/visa-mastercard.svg';
import Paypal from '/public/assets/paypal.svg';
import PayMethod from '@/components/payment/PayMethod';
import AddMethod from '@/components/payment/AddMethod';
import useBalance from '@/hooks/useBalance';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { axiosAuth } from '@/lib/axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NEXT_ROUTES from '@/constants/nextRoutes';

export default function Pay() {
  const [isPaying, setIsPaying] = useState(false);
  const authUser = useSession().data?.user as User;
  const router = useRouter();
  const paymentNote = router.query.paymentNote as string;
  const id = router.query.id as string;
  const { balance, isLoadingBalance, isErrorBalance } = useBalance(authUser?.user_id.toString());
  if (isLoadingBalance) return <p>Loading...</p>;
  if (isErrorBalance) return <p>Error</p>;

  const payWithBalance = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isPaying) {
      event.preventDefault();
      setIsPaying(true);
      const data = {
        payment_method: "Balance",
        note: paymentNote
      };


      axiosAuth
        .post(`trips/${id}/request/`, data)
        .then((response) => {
          router.push(NEXT_ROUTES.HOME);
        })
        .catch((error) => {
          alert("Saldo insuficiente o error en el pago");
          setIsPaying(false);
        });
    }
  }



  return (
    <AnimatedLayout className="justify-between flex flex-col">
      <BackButtonText text="Pago del viaje" />
      <div className="flex h-full flex-col overflow-y-scroll bg-white px-4 pb-4">
        <div className="flex flex-col">
          <span className="text-2xl font-bold">Tus tarjetas</span>
          <div className="my-2 flex flex-col items-center justify-center">
            <div className="my-2 flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray p-12">
              <p className="text-lg">Saldo disponible</p>
              <p className="text-5xl font-bold">{balance.amount}€</p>
            </div>
            <AddMethod text="Añadir método de pago" />
          </div>
        </div>
        <br />
        <div className="flex flex-col">
          <span className="text-2xl font-bold">Métodos de pago</span>
          <div className="flex flex-col items-center justify-center">
            <PayMethod
              logo={<BugalinkLogo color="white" />}
              name="Saldo"
              data={`${balance.amount}€`}
              href="#"
              onClick={payWithBalance}
              disabled={isPaying}
            />
            <PayMethod
              logo={<VisaMastercard height="100%" />}
              name="VISA/Mastercard"
              data="**** **** **** 5678"
              href={`/trips/${id}/creditCardPay`}
              disabled={isPaying}
            />
            <PayMethod
              logo={<Paypal height="100%" />}
              name="Paypal"
              data="pedro@gmail.com"
              href="#"
              disabled={isPaying}
            />
          </div>
        </div>
      </div>
    </AnimatedLayout>
  );
}
