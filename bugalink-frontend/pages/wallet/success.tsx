import { BackButtonText } from '@/components/buttons/Back';
import AnimatedLayout from '@/components/layouts/animated';
import GreenCheck from 'public/assets/green-check.svg';

export default function WalletSuccess() {
  return (
    <AnimatedLayout className="justify-between flex flex-col">
      <BackButtonText text="Acción exitosa" />
      <div className="flex h-full flex-col items-center justify-center overflow-y-scroll bg-white px-4 pb-4">
        <GreenCheck
          className="fill-green stroke-green"
          width="15vh"
          height="15vh"
        />
        <span className="mb-5 text-center text-3xl font-bold">
          La acción se ha realizado correctamente
        </span>
        <span className="text-xl">Gracias por usar BugaLink</span>
      </div>
    </AnimatedLayout>
  );
}
