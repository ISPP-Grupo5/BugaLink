import AnimatedLayout from '@/components/layouts/animated';
import { BackButtonText } from '@/components/buttons/Back';
import CityDriver from 'public/assets/city-driver.svg';
import Check from 'public/assets/check-license.svg';
import FileButton from '@/components/buttons/File';

export default function DriverCCheck() {
  return (
    <AnimatedLayout className="overflow-y-scroll bg-white">
      <BackButtonText text="Hazte conductor" className="bg-white" />
      <CityDriver className="mx-auto" />
      <p className="mr-4 ml-4 py-1 text-base font-bold">
        Gana dinero levando a pasajeros en tu coche que van a tu mismo destino.
        Los poasos a seguir son:
      </p>
      <div className="mt-2 flex flex-col space-y-4">
        <div className="mr-4 ml-4 text-base ">
          <p className='font-bold mb-2'>1. Sube los documentos necesarrios: </p>
          <span className="space-y-2 ">
            <FileButton text="Carnet de Conducir" />
            <FileButton text="Documento de identidad (anverso)" />
            <FileButton text="Documento de identidad (reverso)" />
            <FileButton text="Declaración jurada" />
          </span>
        </div>
        <div className="mr-4 ml-4 text-base font-bold">
          <p>
            2. Espera a la validación por parte de nuestro equipo. Puede tardar
            hasta 48 horas laborales.
          </p>
          <Check className="mx-auto" />
        </div>
        <p className="mr-4 ml-4 text-base font-bold">
          3. Una vez validad tu información podrás empezar a publicar viajes
          como conductor.
        </p>
      </div>
    </AnimatedLayout>
  );
}
