import { BackButtonText } from '@/components/buttons/Back';
import CTAButton from '@/components/buttons/CTA';
import MoneyInput from '@/components/forms/CurrencyInput';
import TextField from '@/components/forms/TextField';
import AnimatedLayout from '@/components/layouts/animated';
import NEXT_ROUTES from '@/constants/nextRoutes';
import useBalance from '@/hooks/useBalance';
import { axiosAuth } from '@/lib/axios';
import { useRouter } from 'next/router';
import { useState } from 'react';

const getErrorMessage = (errors: any, fieldName: string, value: any) => {
  if (!errors[fieldName]) return null;

  const errorObject = errors[fieldName];
  const errorKey = Object.keys(errorObject).find(
    (validator) => !errorObject[validator].isValid(value)
  );

  return errorKey ? errorObject[errorKey].message : null;
};
export default function Withdraw() {
  const [iban, setIban] = useState<string>();
  const [amount, setAmount] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const { balance } = useBalance();
  const router = useRouter();

  const handleWithdrawSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axiosAuth.post('/balance/withdraw', {
        amount: amount,
        iban: iban?.replaceAll(' ', ''),
      });

      if (response.status === 202) {
        router.replace(NEXT_ROUTES.WITHDRAW_CONFIRMATION);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const errors = {
    iban: {
      required: {
        isValid: (iban) => iban && iban.length > 0,
        message: 'El IBAN es obligatorio',
      },
      length: {
        isValid: (iban) => iban && iban.replaceAll(' ', '').length === 24,
        message: 'El IBAN debe tener 24 caracteres',
      },
      format: {
        isValid: (iban) =>
          iban && iban.replaceAll(' ', '').match(/^[A-Z]{2}\d{22}$/),
        message: 'El IBAN no es válido',
      },
    },
  };

  const ibanError = getErrorMessage(errors, 'iban', iban);
  const [moneyError, setMoneyError] = useState();

  return (
    <AnimatedLayout className="flex h-full flex-col justify-between bg-white">
      <BackButtonText text="Retirar saldo" />
      <div className="flex h-full flex-col pb-4">
        <img
          src="/assets/withdraw.png"
          alt="Retirar saldo"
          className="w-full"
        />
        <div className="flex flex-col items-center px-4">
          <MoneyInput
            placeholder="0,00€"
            className="w-1/2 rounded-md px-4 py-2 text-center text-4xl outline outline-1 outline-light-gray focus:outline-turquoise"
            onValueChange={(value) => setAmount(value)}
            max={Number.parseFloat(balance?.amount)}
            setHasErrors={setMoneyError}
          />
          {balance !== undefined && (
            <span className="text-gray">
              Puedes retirar hasta{' '}
              {Number.parseFloat(balance.amount).toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR',
              })}
            </span>
          )}

          <TextField
            type="text"
            fieldName="IBAN"
            content={iban}
            setContent={setIban}
            parentClassName="my-4 w-full"
            error={ibanError}
          />
          <p>
            Recibirás el dinero en tu cuenta bancaria en aproximadamente{' '}
            <b>3 días laborables</b> después de solicitar la retirada de fondos.
          </p>
        </div>
      </div>
      <CTAButton
        className="mx-2 mb-4"
        text="SOLICITAR"
        disabled={isLoading || ibanError || moneyError}
        onClick={handleWithdrawSubmit}
      />
    </AnimatedLayout>
  );
}
