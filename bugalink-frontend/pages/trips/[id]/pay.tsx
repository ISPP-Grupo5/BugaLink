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

export default function Pay() {
  const authUser = useSession().data?.user as User;

  const { balance, isLoadingBalance, isErrorBalance } = useBalance(authUser?.user_id.toString());

  if (isLoadingBalance) return <p>Loading...</p>;
  if (isErrorBalance) return <p>Error</p>;
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
            />
            <PayMethod
              logo={<VisaMastercard height="100%" />}
              name="VISA/Mastercard"
              data="**** **** **** 5678"
              href="#"
            />
            <PayMethod
              logo={<Paypal height="100%" />}
              name="Paypal"
              data="pedro@gmail.com"
              href="#"
            />
          </div>
        </div>
      </div>
    </AnimatedLayout>
  );
}
