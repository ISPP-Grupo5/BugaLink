import { BackButtonText } from '@/components/buttons/Back';
import FileButton from '@/components/buttons/File';
import AnimatedLayout from '@/components/layouts/animated';
import { axiosAuth } from '@/lib/axios';
import { signOut } from 'next-auth/react';
import Check from 'public/assets/check-license.svg';
import CityDriver from 'public/assets/city-driver.svg';
import { useEffect, useState } from 'react';

export default function DriverCheck() {
  const [uploadFile1, setUploadFile1] = useState(false);
  const [uploadFile2, setUploadFile2] = useState(false);
  const [uploadFile3, setUploadFile3] = useState(false);
  const [uploadFile4, setUploadFile4] = useState(false);

  useEffect(() => {
    // if (!uploadFile1 || !uploadFile2 || !uploadFile3 || !uploadFile4) return;

    const sendFiles = async () => {
      // const formData = new FormData();
      // formData.append('file1', uploadFile1);
      // formData.append('file2', uploadFile2);
      // formData.append('file3', uploadFile3);
      // formData.append('file4', uploadFile4);
      // const response = await axiosAuth.post('/drivers/documents', formData);
      try {
        const response = await axiosAuth.post('/users/become-driver/', {});
        if (response.status === 200) {
          signOut();
        }
      } catch (error) {
        alert(error?.response?.data?.message || 'Error al enviar los archivos');
      }
    };
    sendFiles();
  }, [uploadFile1, uploadFile2, uploadFile3, uploadFile4]);
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
              text="Carnet de conducir"
              upload={uploadFile1}
              setUpload={setUploadFile1}
            />
            <FileButton
              text="Documento de identidad (anverso)"
              upload={uploadFile2}
              setUpload={setUploadFile2}
            />
            <FileButton
              text="Documento de identidad (reverso)"
              upload={uploadFile3}
              setUpload={setUploadFile3}
            />
            <FileButton
              text="Declaración jurada"
              upload={uploadFile4}
              setUpload={setUploadFile4}
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
