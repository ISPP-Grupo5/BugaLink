import { useState } from 'react';
import { BackButtonText } from '../../../../../components/buttons/Back';
import CTAButton from '../../../../../components/buttons/CTA';
import SelectField from '../../../../../components/forms/SelectField';
import TextAreaField from '../../../../../components/forms/TextAreaField';
import AnimatedLayout from '../../../../../components/layouts/animated';

export default function ReportProblem() {
  const [selectedOption, setSelectedOption] = useState('');
  const [problem, setProblem] = useState('');

  const options = [
    { value: 'C', label: 'El conductor' },
    { value: 'P1', label: 'Pasajero 1' },
    { value: 'P2', label: 'Pasajero 2' },
    { value: 'P3', label: 'Pasajero 3' },
  ];

  return (
    <AnimatedLayout className="flex flex-col justify-between">
      <BackButtonText text="Cuéntanos tu problema" />
      <div className="flex flex-col px-4 pb-4 pt-3 h-full overflow-y-scroll bg-white">
        <div className="flex flex-col">
          <SelectField
            label="He tenido un problema con..."
            id="people"
            options={options}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            inputClassName="w-full"
          />
        </div>
        <div className="flex flex-col my-4">
          <TextAreaField
            fieldName="Resume brevemente el problema"
            content={problem}
            setContent={setProblem}
            inputClassName="w-full"
          />
        </div>
        <div className="flex flex-col items-center">
          <CTAButton className="w-11/12" text="ENVIAR" />
        </div>
      </div>
    </AnimatedLayout>
  );
}
