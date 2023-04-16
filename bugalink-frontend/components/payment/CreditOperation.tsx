import { BackButtonText } from '../buttons/Back';
import AnimatedLayout from '../layouts/animated';
import TextField from '@/components/forms/TextField';
import PayMethod from './PayMethod';
import VisaMastercard from '/public/assets/visa-mastercard.svg';
import Paypal from '/public/assets/paypal.svg';
import { useState } from 'react';
import { axiosAuth } from '@/lib/axios';
import { useRouter } from 'next/router';

type CreditOperationProps = {
  textBackButton: string;
  title: string;
};

export default function CreditOperation({
  textBackButton,
  title,
}: CreditOperationProps) {
  const [amount, setAmount] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const router = useRouter();


  const rechargeWithCreditCard = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isPaying) {
      event.preventDefault();
      setIsPaying(true);

      try {
        const dataPost = {
          amount,
        };
        const { data } = await axiosAuth.post(`recharge/credit-card/`, dataPost);
        router.push(data.url);
      } catch (error) {
        alert('Error en el pago');
        setIsPaying(false);
      }
    }
  };

  const rechargeWithPayPal = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isPaying) {
      event.preventDefault();
      setIsPaying(true);

      try {
        const dataPost = {
          amount,
        };
        const { data } = await axiosAuth.post(`recharge/paypal/`, dataPost);
        router.push(data.url);
      } catch (error) {
        alert('Error en el pago');
        setIsPaying(false);
      }
    }
  };
  return (
    <AnimatedLayout className="flex flex-col justify-between">
      <BackButtonText text={textBackButton} />
      <div className="flex h-full flex-col overflow-y-scroll bg-white px-4 pb-4">
        <div className="my-3 mt-4 flex flex-col">
          <TextField
            type={'number'}
            content={amount}
            name="amount"
            fieldName={'Introduce una cantidad para recargar'}
            inputClassName="w-full"
            setContent={setAmount}
            parentClassName="w-full flex flex-col items-center"
          />
        </div>
        <br />
        <div className="flex flex-col">
          <span className="text-2xl font-bold">{title}</span>
          <div className="flex flex-col items-center justify-center">
            <PayMethod
              logo={<VisaMastercard />}
              name="VISA/Mastercard"
              data=""
              onClick={rechargeWithCreditCard}
              disabled={isPaying}
            />
            <PayMethod
              logo={<Paypal />}
              name="Paypal"
              data=""
              onClick={() => {
                return;
              }}
              disabled={isPaying}
            />
          </div>
        </div>
      </div>
    </AnimatedLayout>
  );
}

// Link href next.js
// router.push('/trips/[id]/pay');
