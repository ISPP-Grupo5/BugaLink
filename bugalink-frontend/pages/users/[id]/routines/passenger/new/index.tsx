import { useEffect, useState } from 'react';
import BackButton from '../../../../../../components/buttons/Back';
import CTAButton from '../../../../../../components/buttons/CTA';
import TextField from '../../../../../../components/forms/TextField';
import TimePicker from '../../../../../../components/forms/TimePicker';
import Layout from '../../../../../../components/Layout';

const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export default function NewRoutine() {
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
            <label className="text-xl font-bold">Hora de recogida</label>
            <span className="mt-2 flex items-center space-x-2 text-xl">
              <TimePicker time={pickTimeFrom} setTime={setPickTimeFrom} />
              <p>hasta las</p>{' '}
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
          <CTAButton className="mt-6 w-full" text="CREAR" />
        </div>
      </div>
    </Layout>
  );
}
