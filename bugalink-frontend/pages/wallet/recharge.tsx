import { BackButtonText } from '@/components/buttons/Back';
import MoneyInput from '@/components/forms/CurrencyInput';
import AnimatedLayout from '@/components/layouts/animated';
import PayMethod from '@/components/payment/PayMethod';
import { axiosAuth } from '@/lib/axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Paypal from '/public/assets/paypal.svg';
import VisaMastercard from '/public/assets/visa-mastercard.svg';

export default function Recharge() {
  const [amount, setAmount] = useState<string>('0');
  const [isPaying, setIsPaying] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const router = useRouter();

  const rechargeWithCreditCard = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (isPaying || paymentIsDisabled) return;

    event.preventDefault();
    setIsPaying(true);

    try {
      const payload = {
        amount,
      };
      const { data } = await axiosAuth.post(`recharge/credit-card/`, payload);
      router.push(data.url);
    } catch (error) {
      alert('Error en el pago');
      setIsPaying(false);
    }
  };

  const rechargeWithPayPal = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (isPaying || paymentIsDisabled) return;

    event.preventDefault();
    setIsPaying(true);

    try {
      const payload = {
        amount,
      };
      const { data } = await axiosAuth.post(`recharge/paypal/`, payload);
      router.push(data.url);
    } catch (error) {
      alert('Error en el pago');
      setIsPaying(false);
    }
  };

  const paymentIsDisabled = isPaying || !amount || hasErrors;

  return (
    <AnimatedLayout className="justify-between flex flex-col">
      <BackButtonText text="Recargar saldo" />
      <div className="flex h-full flex-col overflow-y-scroll bg-white px-4 pb-4">
        <div className="my-3 mt-4 flex w-full flex-col items-center">
          <MoneyInput
            placeholder="0,00€"
            className="w-1/2 rounded-md px-4 py-2 text-center text-4xl outline outline-1 outline-light-gray focus:outline-turquoise"
            onValueChange={(value) => setAmount(value)}
            setHasErrors={setHasErrors}
          />
          <span className="text-gray">
            Puedes recargar hasta{' '}
            {Number(1000).toLocaleString('es-ES', {
              style: 'currency',
              currency: 'EUR',
            })}{' '}
          </span>
        </div>
        <br />
        <div className="flex flex-col">
          <span className="text-2xl font-bold">Método de recarga</span>
          <div className="flex flex-col items-center justify-center">
            <PayMethod
              logo={<VisaMastercard />}
              name="VISA/Mastercard"
              data=""
              onClick={rechargeWithCreditCard}
              disabled={paymentIsDisabled}
            />
            <PayMethod
              logo={<Paypal />}
              name="Paypal"
              data=""
              onClick={rechargeWithPayPal}
              disabled={paymentIsDisabled}
            />
          </div>
        </div>
      </div>
    </AnimatedLayout>
  );
}
