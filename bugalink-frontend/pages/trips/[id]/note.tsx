import { useState } from 'react';
import CTAButton from '@/components/buttons/CTA';
import TextAreaField from '@/components/forms/TextAreaField';
import NEXT_ROUTES from '@/constants/nextRoutes';
import { useRouter } from 'next/router';

export default function NoteToDriver() {
  const [note, setNote] = useState('');
  const router = useRouter();
  const tripId = router.query.id as string;
  return (
    <div className="flex h-full flex-col overflow-y-scroll rounded-t-lg bg-white px-4 pb-4 pt-3">
      <p className="mb-2 text-3xl font-semibold">Añadir nota al conductor</p>
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
        <CTAButton
          className="w-11/12"
          text="SOLICITAR"
          onClick={() =>
            router.push({
              pathname: NEXT_ROUTES.TRIP_PAYMENT(tripId),
              query: { note: note },
            })
          }
        />
      </div>
    </div>
  );
}
