import TimePicker from '@/components/forms/TimePicker';
import CTAButton from '@/components/buttons/CTA';
import { Drawer } from '@mui/material';
import React, { useEffect, useState } from 'react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  hourFrom: string;
  setHourFrom: (value: string) => void;
  hourTo: string;
  setHourTo: (value: string) => void;
};

export default function HourFilter({
  open,
  setOpen,
  hourFrom,
  setHourFrom,
  hourTo,
  setHourTo,
}: Props) {
  const [timeFromProvisional, setTimeFromProvisional] = useState(hourFrom);
  const [timeToProvisional, setTimeToProvisional] = useState(hourTo);
  const [errorPickTime, setErrorPickTime] = useState<string | null>();

  useEffect(() => {
    const pickTimeFromHour = parseInt(timeFromProvisional.split(':')[0]);
    const pickTimeFromMinutes = parseInt(timeFromProvisional.split(':')[1]);
    const pickTimeToHour = parseInt(timeToProvisional.split(':')[0]);
    const pickTimeToMinutes = parseInt(timeToProvisional.split(':')[1]);

    if (
      pickTimeFromHour > pickTimeToHour ||
      (pickTimeFromHour === pickTimeToHour &&
        pickTimeFromMinutes >= pickTimeToMinutes)
    ) {
      setErrorPickTime('La hora de fin debe ser mayor que la hora de inicio');
    } else {
      setErrorPickTime(null);
    }
  }, [timeFromProvisional, timeToProvisional]);

  const handleApplyFilters = () => {
    if (errorPickTime) return;
    setHourFrom(timeFromProvisional);
    setHourTo(timeToProvisional);
    setOpen(false);
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={() => setOpen(false)}
      SlideProps={{
        style: {
          minWidth: '320px',
          maxWidth: '480px',
          width: '100%',
          margin: '0 auto',
          backgroundColor: 'transparent',
        },
      }}
    >
      <div className="rounded-t-lg bg-white">
        <div className="ml-6 mt-2">
          <p className="font-lato text-xl font-bold">Hora de salida</p>
          <p className="mb-6 text-sm">Define el rango de hora de salida</p>
          <span className="mt-4 flex items-center justify-center space-x-2 text-xl font-bold">
            <TimePicker
              time={timeFromProvisional}
              setTime={setTimeFromProvisional}
            />
            <p> — </p>
            <TimePicker
              time={timeToProvisional}
              setTime={setTimeToProvisional}
              error={errorPickTime}
            />
          </span>
          <span className="mt-1 flex items-center justify-center text-sm text-red">
            {errorPickTime}
          </span>
        </div>
        <div className="my-5 flex flex-col items-center">
          <CTAButton
            className="w-11/12"
            text={'FILTRAR'}
            onClick={handleApplyFilters}
          />
        </div>
      </div>
    </Drawer>
  );
}
