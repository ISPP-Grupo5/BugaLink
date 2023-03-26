import AnimatedLayout from '@/components/layouts/animated';
import { BackButtonText } from '@/components/buttons/Back';
import CityDriver from 'public/assets/city-driver.svg';
import Check from 'public/assets/check-license.svg';
import FileButton from '@/components/buttons/File';

export default function DriverCCheck() {
  return (
    <AnimatedLayout className="overflow-y-scroll bg-white px-4">
      <BackButtonText text="Hazte conductor" className="bg-white" />
      <CityDriver className="mx-auto" />
      <p className="py-1 text-base">
        Gana dinero llevando a pasajeros en tu coche que van a tu mismo destino.
        Los pasos a seguir son:
      </p>
      <div className="mt-4 flex flex-col space-y-4">
        <div className="text-base">
          <p className="mb-4 font-bold">1. Sube los documentos necesarios: </p>
          <span className="space-y-2 ">
            <FileButton text="Carnet de conducir" />
            <FileButton text="Documento de identidad (anverso)" />
            <FileButton text="Documento de identidad (reverso)" />
            <FileButton text="Declaración jurada" />
          </span>
        </div>
        <div className="text-base">
          <p>
            2. Espera a la validación por parte de nuestro equipo. Puede tardar
            hasta 48 horas laborales.
          </p>
          <Check className="mx-auto" />
        </div>
        <p className="text-base font-bold">
          3. Una vez validada tu información podrás empezar a publicar viajes
          como conductor.
        </p>
      </div>
    </AnimatedLayout>
  );
}
