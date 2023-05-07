import AnimatedLayout from '@/components/layouts/animated';
import { BackButtonText } from '@/components/buttons/Back';
import TransparentButton from '@/components/buttons/Transparent';
import Recargar from '/public/assets/recargar.svg';
import Retirar from '/public/assets/retirar.svg';
import TransactionList from '@/components/cards/transactions';
import Link from 'next/link';
import NEXT_ROUTES from '@/constants/nextRoutes';
import useBalance from '@/hooks/useBalance';
import useExpectedExpense from '@/hooks/useExpectedExpense';
import { useRouter } from 'next/router';

export default function Wallet() {
  const router = useRouter();
  const { balance } = useBalance();
  const { expectedExpense } = useExpectedExpense();
  const amount =
    balance !== undefined
      ? Number.parseFloat(balance.amount).toLocaleString('es-ES', {
          style: 'currency',
          currency: 'EUR',
        })
      : '--,-- €';
  const expectedExpenseAmount =
    expectedExpense !== undefined
      ? Number.parseFloat(expectedExpense).toLocaleString('es-ES', {
          style: 'currency',
          currency: 'EUR',
        })
      : '--,-- €';

  const canWithdraw = balance && Number.parseFloat(balance.amount) > 0;

  return (
    <AnimatedLayout className="flex flex-col overflow-y-scroll">
      <BackButtonText text="Mi cartera" className="bg-base-origin" />
      <div className="ml-4 mr-4 flex flex-col place-content-center space-y-3 rounded-2xl border-2 border-dashed border-light-gray bg-white py-4">
        <div className="mt-2 text-center">
          <p className="text-xs text-gray">Saldo disponible</p>
          <p className="text-3xl font-bold text-black">{amount}</p>
        </div>

        {
          <div className="text-center">
            <p className="text-xs text-gray">Gasto esperado esta semana</p>
            <p className="text-xl font-bold text-black">
              {expectedExpenseAmount}
            </p>
          </div>
        }
      </div>
      <div className="justify-between my-5 flex space-x-2 px-4">
        <div className="flex-1">
          <Link href={NEXT_ROUTES.RECHARGE_CREDIT}>
            <TransparentButton text="Recargar cuenta" Icon={<Recargar />} />
          </Link>
        </div>
        <div className="flex-1">
          <TransparentButton
            text="Retirar saldo"
            Icon={<Retirar />}
            disabled={!canWithdraw}
            onClick={() => {
              if (!canWithdraw) return;
              router.push(NEXT_ROUTES.WITHDRAW_BALANCE);
            }}
          />
        </div>
      </div>
      <p className="rounded-t-3xl bg-white py-5 pl-5 text-left text-3xl text-black">
        Últimos movimientos
      </p>
      <div className="h-full divide-y-2 divide-light-gray overflow-y-scroll bg-white">
        <TransactionList />
      </div>
    </AnimatedLayout>
  );
}
