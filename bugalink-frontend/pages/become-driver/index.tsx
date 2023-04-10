import { BackButtonText } from '@/components/buttons/Back';
import FileButton from '@/components/buttons/File';
import AnimatedLayout from '@/components/layouts/animated';
import DocumentStatusI from '@/interfaces/documents';
import { axiosAuth } from '@/lib/axios';
import { signOut } from 'next-auth/react';
import Check from 'public/assets/check-license.svg';
import CityDriver from 'public/assets/city-driver.svg';
import { useEffect, useState } from 'react';

export default function BecomeDriver() {
  const [driverLicenseStatus, setDriverLicenseStatus] =
    useState<DocumentStatusI>('Waiting upload');
  const [dniStatus, setDniStatus] = useState<DocumentStatusI>('Waiting upload');
  const [swornDeclaration, setSwornDeclaration] =
    useState<DocumentStatusI>('Waiting upload');

  useEffect(() => {
    // Fill the status of the documents on the first render
    const getDriverDocs = async () => {
      try {
        const response = await axiosAuth.put('/drivers/docs');
        if (response.status === 200) {
          const {
            driver_license_status,
            dni_status,
            sworn_declaration_status,
          } = response.data;
          setDriverLicenseStatus(driver_license_status);
          setDniStatus(dni_status);
          setSwornDeclaration(sworn_declaration_status);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getDriverDocs();
  }, []);

  useEffect(() => {
    if (
      driverLicenseStatus === 'Validated' &&
      dniStatus === 'Validated' &&
      swornDeclaration === 'Validated'
    ) {
      signOut({
        callbackUrl: '/',
      }); // For forcing token refresh. Ideally this would be done by refreshing the auth token
    }
  }, [driverLicenseStatus, dniStatus, swornDeclaration]);

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
          <p className="mb-4">1. Sube los documentos necesarios: </p>
          <span className="space-y-2 ">
            <FileButton
              text="Declaración jurada"
              fileName="sworn_declaration"
              statusName="sworn_declaration_status"
              status={swornDeclaration}
              setStatus={setSwornDeclaration}
            />
            <FileButton
              text="Carnet de conducir"
              fileName="driver_license"
              statusName="driver_license_status"
              status={driverLicenseStatus}
              setStatus={setDriverLicenseStatus}
            />
            <FileButton
              text="Documento de identidad (anverso)"
              fileName="dni_front"
              statusName="dni_status"
              status={dniStatus}
              setStatus={setDniStatus}
            />
            <FileButton
              text="Documento de identidad (reverso)"
              fileName="dni_back"
              statusName="dni_status"
              status={dniStatus}
              setStatus={setDniStatus}
            />
          </span>
        </div>
        <div className="text-base">
          <p>
            2. Espera a la validación por parte de nuestro equipo. Puede tardar
            hasta 48 horas laborales.
          </p>
          <Check className="mx-auto my-4" />
        </div>
        <p className="text-base">
          3. Una vez validada tu información podrás empezar a publicar viajes
          como conductor.
        </p>
      </div>
    </AnimatedLayout>
  );
}
