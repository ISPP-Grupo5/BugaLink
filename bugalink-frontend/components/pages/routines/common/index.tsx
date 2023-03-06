import { useState } from 'react';
import BackButton from '../../../buttons/Back';
import CTAButton from '../../../buttons/CTA';
import TextField from '../../../forms/TextField';
import TimePicker from '../../../forms/TimePicker';
import Layout from '../../../Layout';

const MIN_FREE_SEATS = 1;
const MAX_FREE_SEATS = 8;

const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

type Props = {
  userType: 'passenger' | 'driver';
  freeSeatsNumber?: number;
  setFreeSeatsNumber?: (number) => void;
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
    <Layout>
      <BackButton />
      <img src="/assets/mocks/map.png" className="w-full fixed" />
      <div className="fixed w-full flex flex-col bg-white bottom-0 rounded-t-3xl pb-4 pt-8 px-10">
        <div className="h-full">
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
          <div className="flex flex-col mb-4">
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
          <span className="mt-2 grid grid-cols-7 items-center text-center bg-white border border-light-gray rounded-xl text-xl divide-x divide-light-gray overflow-hidden">
            {days.map((day) => (
              <p
                key={day}
                className={`w-full h-full py-2 transition-colors duration-300 ${
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
            <PassengersCounter
              freeSeatsNumber={freeSeatsNumber}
              setFreeSeatsNumber={setFreeSeatsNumber}
            />
          )}
          <CTAButton className="mt-6 w-full" text="CREAR" />
        </div>
      </div>
    </Layout>
  );
}

const PassengersCounter = ({ freeSeatsNumber, setFreeSeatsNumber }) => {
  return (
    <div className="mt-4 flex flex-col justify-center w-full">
      <p className="text-xl font-bold mb-2">¿Cuántos asientos ofreces?</p>
      <div className="relative w-full text-center bg-light-gray font-semibold p-1 rounded-xl flex justify-between items-center">
        <button
          className="w-10 h-10 bg-white rounded-lg text-xl flex items-center justify-center"
          onClick={() =>
            setFreeSeatsNumber(Math.max(MIN_FREE_SEATS, freeSeatsNumber - 1))
          }
        >
          —
        </button>
        <p className="text-xl">{freeSeatsNumber}</p>
        <button
          className="w-10 h-10 bg-white rounded-lg text-2xl flex items-center justify-center"
          onClick={() =>
            setFreeSeatsNumber(Math.min(MAX_FREE_SEATS, freeSeatsNumber + 1))
          }
        >
          +
        </button>
      </div>
    </div>
  );
};
