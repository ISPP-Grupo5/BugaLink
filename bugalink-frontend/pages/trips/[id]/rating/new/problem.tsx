import { useState } from 'react';
import CTAButton from '@/components/buttons/CTA';
import SelectField from '@/components/forms/SelectField';
import TextAreaField from '@/components/forms/TextAreaField';
import { GetServerSideProps } from 'next';
import NEXT_ROUTES from '@/constants/nextRoutes';
import { axiosAuth } from '@/lib/axios';
import useTrip from '@/hooks/useTrip';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  const data = {
    id: id,
  };

  return {
    props: { data },
  };
};

export default function ReportProblem({ data }) {


  //Esta comentado el elgir aquien reportar por falta de tiempo, esta hecho de momento solo para que se reporte al conductor del viaje
  // const [selectedOption, setSelectedOption] = useState('');
  

  // const options = [
  //   { value: 'C', label: 'El conductor' },
  //   { value: 'P1', label: 'Pasajero 1' },
  //   { value: 'P2', label: 'Pasajero 2' },
  //   { value: 'P3', label: 'Pasajero 3' },
  // ];

  const [problem, setProblem] = useState('');

  const { trip, isLoading, isError } = useTrip(data);

  const driver= trip? trip.driver : null;


  const datos = {
    reported_user_id: driver.user.id,
    note: problem
  }

  const handleSubmit = async () => {

    const url = 'trips/' + data + '/report-issue/';
        axiosAuth
          .post(url, datos)
          .then((response) => {
            console.log(response.data);
            window.location.href = NEXT_ROUTES.HOME;
          })
          .catch((error) => {
            console.error(error);
          });

  };

  return (
    <div className="flex h-full flex-col overflow-y-scroll rounded-t-lg bg-white px-4 pb-4 pt-3">
      {/* <div className="my-3 flex flex-col">
        <SelectField
          label="He tenido un problema con..."
          options={options}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
      </div> */}
      <div className="my-3 flex flex-col">
        <TextAreaField
          fieldName="Resume brevemente el problema"
          content={problem}
          setContent={setProblem}
          inputClassName="w-full"
          rows={8}
        />
      </div>
      <div className="flex flex-col items-center">
        <CTAButton className="w-11/12" text="ENVIAR" onClick={handleSubmit} />
      </div>
    </div>
  );
}
