import { useState } from 'react';
import CTAButton from '@/components/buttons/CTA';
import TextAreaField from '@/components/forms/TextAreaField';

export default function NoteToDriver() {
  const [note, setNote] = useState('');

  return (
    <div className="flex h-full flex-col overflow-y-scroll rounded-t-lg bg-white px-4 pb-4 pt-3">
      <p className="text-3xl font-semibold mb-2">Añadir nota al conductor</p>
      <div className="my-3 flex flex-col">
        <TextAreaField
          fieldName="¿Qué le quieres decir al conductor?"
          content={note}
          setContent={setNote}
          inputClassName="w-full"
          rows={8}
        />
      </div>
      <div className="flex flex-col items-center">
        <CTAButton className="w-11/12" text="SOLICITAR" />
      </div>
    </div>
  );
}
