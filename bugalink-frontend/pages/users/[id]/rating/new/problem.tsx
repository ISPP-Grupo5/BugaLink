import { useState } from 'react';
import { BackButtonText } from '../../../../../components/buttons/Back';
import CTAButton from '../../../../../components/buttons/CTA';
import SelectField from '../../../../../components/forms/SelectField';
import TextAreaField from '../../../../../components/forms/TextAreaField';

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
    <div className="flex flex-col px-4 pb-4 pt-3 h-full overflow-y-scroll bg-white rounded-t-lg">
      <div className="flex flex-col my-3">
        <SelectField
          label="He tenido un problema con..."
          id="people"
          options={options}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          inputClassName="w-full"
        />
      </div>
      <div className="flex flex-col my-3">
        <TextAreaField
          fieldName="Resume brevemente el problema"
          content={problem}
          setContent={setProblem}
          inputClassName="w-full"
          rows={8}
        />
      </div>
      <div className="flex flex-col items-center">
        <CTAButton className="w-11/12" text="ENVIAR" />
      </div>
    </div>
  );
}
