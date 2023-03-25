import AnimatedLayout from '@/components/layouts/animated';
import { BackButtonText } from '@/components/buttons/Back';
import TransparentButton from '@/components/buttons/Transparent';
import Recargar from '/public/assets/recargar.svg';
import Retirar from '/public/assets/retirar.svg';
import Transaction from '@/components/cards/transactions';
import Link from 'next/link';
import NEXT_ROUTES from '@/constants/nextRoutes';

export default function Wallet() {
  return (
    <AnimatedLayout className="flex flex-col overflow-y-scroll">
      <BackButtonText text="Mi cartera" className="bg-base-origin" />
      <div className="ml-4 mr-4 flex flex-col place-content-center space-y-3 rounded-2xl border-2 border-dashed border-light-gray bg-white py-4">
        <div className="mt-2 text-center">
          <p className="text-xs text-gray">Saldo disponible</p>
          <p className="text-3xl font-bold text-black">13,30€</p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray">Pendiente por cobrar</p>
          <p className="text-xl font-bold text-black">3,75€</p>
        </div>
      </div>
      <div className="my-5 flex justify-between space-x-2 px-4">
        <div className="flex-1">
          <Link href={NEXT_ROUTES.RECHARGE_CREDIT(1)}>
            <TransparentButton text="Recargar cuenta" Icon={<Recargar />} />
          </Link>
        </div>
        <div className="flex-1">
          <Link href={NEXT_ROUTES.WITHDRAW_CREDIT(1)}>
            <TransparentButton text="Retirar saldo" Icon={<Retirar />} />
          </Link>
        </div>
      </div>

      <p className="rounded-t-3xl bg-white py-5 pl-5 text-left text-3xl text-black">
        Últimos movimientos
      </p>
      <div className="divide-y-2 divide-light-gray overflow-y-scroll bg-white">
        <Transaction
          people="Juan Blanco y 2 más..."
          travelType="Conductor"
          date="8 feb"
          className="text-yellow"
          money="+3,75€"
          Icon="/icons/Vista-Principal/hombre.png"
          Icon2="/icons/Vista-Principal/hombre.png"
          Icon3="/icons/Vista-Principal/hombre.png"
          isPending={true}
        />
        <Transaction
          people="María T. Romero"
          travelType="Pasajero"
          date="8 feb"
          className="text-red"
          money="-2,00€"
          Icon="/icons/Vista-Principal/hombre.png"
        />
        <Transaction
          people="Juan Blanco y 2 más..."
          travelType="Conductor"
          date="1 feb"
          className="text-green"
          money="+3,75€"
          Icon="/icons/Vista-Principal/hombre.png"
          Icon2="/icons/Vista-Principal/hombre.png"
          Icon3="/icons/Vista-Principal/hombre.png"
        />
        <Transaction
          people="Recarga de saldo"
          date="25 ene"
          className="text-green"
          money="5,00€"
          Icon="/assets/bank.png"
        />
        <Transaction
          people="Juan Blanco y 2 más..."
          travelType="Conductor"
          date="18 ene"
          className="text-green"
          money="+3,75€"
          Icon="/icons/Vista-Principal/hombre.png"
          Icon2="/icons/Vista-Principal/hombre.png"
          Icon3="/icons/Vista-Principal/hombre.png"
        />
        <Transaction
          people="Retirada de saldo"
          date="1 ene"
          className="text-red"
          money="-30,00€"
          Icon="/assets/bank.png"
        />
        <Transaction
          people="Juan Blanco y 2 más..."
          travelType="Conductor"
          date="25 dic"
          className="text-green"
          money="+3,75€"
          Icon="/icons/Vista-Principal/hombre.png"
          Icon2="/icons/Vista-Principal/hombre.png"
          Icon3="/icons/Vista-Principal/hombre.png"
        />
      </div>
    </AnimatedLayout>
  );
}
