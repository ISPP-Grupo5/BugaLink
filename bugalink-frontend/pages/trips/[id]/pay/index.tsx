import { BackButtonText } from '@/components/buttons/Back';
import AnimatedLayout from '@/components/layouts/animated';
import AddMethod from '@/components/payment/AddMethod';
import PayMethod from '@/components/payment/PayMethod';
import NEXT_ROUTES from '@/constants/nextRoutes';
import useBalance from '@/hooks/useBalance';
import { axiosAuth } from '@/lib/axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import BugalinkLogo from '/public/assets/bugalink.svg';
import Paypal from '/public/assets/paypal.svg';
import VisaMastercard from '/public/assets/visa-mastercard.svg';

export default function Pay() {
  const [isPaying, setIsPaying] = useState(false);
  const router = useRouter();
  const note = router.query.note as string;
  const id = router.query.id as string;
  const { balance } = useBalance();

  const amount = balance
    ? Number.parseFloat(balance.amount).toLocaleString('es-ES', {
        style: 'currency',
        currency: 'EUR',
      })
    : '--,-- €';

  const payWithBalance = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isPaying) {
      event.preventDefault();
      setIsPaying(true);
      const data = {
        payment_method: 'Balance',
        note,
      };

      try {
        await axiosAuth.post(`trips/${id}/request/`, data);
        router.replace(NEXT_ROUTES.HOME);
      } catch (error) {
        alert('Saldo insuficiente o error en el pago');
        setIsPaying(false);
      }
    }
  };

  return (
    <AnimatedLayout className="flex flex-col justify-between">
      <BackButtonText text="Pago del viaje" />
      <div className="flex h-full flex-col overflow-y-scroll bg-white px-4 pb-4">
        <div className="flex flex-col">
          <span className="text-2xl font-bold">Tus tarjetas</span>
          <div className="my-2 flex flex-col items-center justify-center">
            <div className="my-2 flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray p-12">
              <p className="text-lg">Saldo disponible</p>
              <p className="text-5xl font-bold">{amount}</p>
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
              data={amount}
              onClick={payWithBalance}
              disabled={isPaying}
            />
            <PayMethod
              logo={<VisaMastercard height="100%" />}
              name="VISA/Mastercard"
              data="**** **** **** 5678"
              onClick={() =>
                router.push({
                  pathname: NEXT_ROUTES.TRIP_PAYMENT_CREDIT(id),
                  query: { note },
                })
              }
              disabled={isPaying}
            />
            <PayMethod
              logo={<Paypal height="100%" />}
              name="Paypal"
              data="pedro@gmail.com"
              // href="#"
              disabled={isPaying}
            />
          </div>
        </div>
      </div>
    </AnimatedLayout>
  );
}
