import { useState } from 'react';
import { BackButton } from '../../../buttons/Back';
import CTAButton from '../../../buttons/CTA';
import PlusMinusCounter from '../../../buttons/PlusMinusCounter';
import TextField from '../../../forms/TextField';
import TimePicker from '../../../forms/TimePicker';

const MIN_FREE_SEATS = 1;
const MAX_FREE_SEATS = 8;

const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

type Props = {
  userType: 'passenger' | 'driver';
  freeSeatsNumber?: number;
  setFreeSeatsNumber?: (freeSeats: number) => void;
};

export default function NewRoutine({
  userType,
  freeSeatsNumber,
  setFreeSeatsNumber,
}: Props) {
  const [originAddress, setOriginAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [pickTimeFrom, setPickTimeFrom] = useState('12:00');
  const [pickTimeTo, setPickTimeTo] = useState('12:10');
  const [selectedDays, setSeletedDays] = useState([]);

  return (
    <div>
      <BackButton />
      <img src="/assets/mocks/map.png" className="w-full" />
      <form className="absolute bottom-0 z-10 flex w-full flex-col rounded-t-3xl bg-white px-10 pb-4 pt-8">
        <TextField
          type={'text'}
          fieldName={'Desde'}
          content={originAddress}
          setContent={setOriginAddress}
          parentClassName="mb-6"
          inputClassName="w-full"
        />
        <TextField
          type={'text'}
          fieldName={'Hasta'}
          content={destinationAddress}
          setContent={setDestinationAddress}
          parentClassName="mb-8"
          inputClassName="w-full"
        />
        <div className="mb-4 flex flex-col">
          <label className="text-xl font-bold">
            {userType === 'passenger' ? 'Hora de recogida' : 'Hora de salida'}
          </label>
          <span className="mt-2 flex items-center space-x-2 text-xl">
            <p>Entre las</p>{' '}
            <TimePicker time={pickTimeFrom} setTime={setPickTimeFrom} />
            <p>y las</p>{' '}
            <TimePicker time={pickTimeTo} setTime={setPickTimeTo} />
          </span>
        </div>

        <label className="text-xl font-bold">Días de la semana</label>
        <span className="mt-2 grid grid-cols-7 items-center divide-x divide-light-gray overflow-hidden rounded-xl border border-light-gray bg-white text-center text-xl">
          {days.map((day) => (
            <p
              key={day}
              className={`h-full w-full py-2 transition-colors duration-300 ${
                selectedDays.includes(day) ? 'bg-turquoise text-white' : ''
              }`}
              onClick={() => {
                if (selectedDays.includes(day)) {
                  setSeletedDays(selectedDays.filter((d) => d !== day));
                } else {
                  setSeletedDays([...selectedDays, day]);
                }
              }}
            >
              {day}
            </p>
          ))}
        </span>
        {userType === 'driver' && (
          <div className="mt-4 flex w-full flex-col justify-center">
            <p className="mb-2 text-xl font-bold">¿Cuántos asientos ofreces?</p>
            <PlusMinusCounter
              text={freeSeatsNumber.toString()}
              onMinusClick={() =>
                setFreeSeatsNumber(
                  Math.max(MIN_FREE_SEATS, freeSeatsNumber - 1)
                )
              }
              onPlusClick={() =>
                setFreeSeatsNumber(
                  Math.min(MAX_FREE_SEATS, freeSeatsNumber + 1)
                )
              }
            />
          </div>
        )}
        <CTAButton className="mt-6 w-full" text="CREAR" />
      </form>
    </div>
  );
}
