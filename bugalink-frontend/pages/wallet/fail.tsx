import { BackButtonText } from '@/components/buttons/Back';
import AnimatedLayout from '@/components/layouts/animated';
import RedCancel from 'public/assets/cancel.svg';

export default function WalletFail() {
  return (
    <AnimatedLayout className="justify-between flex flex-col">
      <BackButtonText text="Acción fallida" />
      <div className="flex h-full flex-col items-center justify-center overflow-y-scroll bg-white px-4 pb-4">
        <RedCancel className="fill-red stroke-red" width="15vh" height="15vh" />
        <span className="mb-5 text-center text-3xl font-bold">
          La acción no se ha realizado correctamente
        </span>
        <span className="text-center text-xl">
          Inténtalo de nuevo en unos instantes, sentimos las molestias
        </span>
      </div>
    </AnimatedLayout>
  );
}
