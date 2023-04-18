import TimePicker from '@/components/forms/TimePicker';
import CTAButton from '@/components/buttons/CTA';
import { Drawer } from '@mui/material';
import React, { useEffect, useState } from 'react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  hourFrom: string;
  hourTo: string;
  setHourFrom: (hourFrom: string) => void;
  setHourTo: (hourTo: string) => void;
  handleSearch;
};

export default function HourFilter({ open, setOpen, hourFrom, hourTo, setHourFrom, setHourTo, handleSearch }: Props) {
  const [errorPickTime, setErrorPickTime] = useState<string | null>();

  useEffect(() => {
    const pickTimeFromHour = parseInt(hourFrom.split(':')[0]);
    const pickTimeFromMinutes = parseInt(hourFrom.split(':')[1]);
    const pickTimeToHour = parseInt(hourTo.split(':')[0]);
    const pickTimeToMinutes = parseInt(hourTo.split(':')[1]);

    if (
      pickTimeFromHour > pickTimeToHour ||
      (pickTimeFromHour === pickTimeToHour &&
        pickTimeFromMinutes >= pickTimeToMinutes)
    ) {
      setErrorPickTime('La hora de fin debe ser mayor que la hora de inicio');
    } else {
      setErrorPickTime(null);
    }
  }, [hourFrom, hourTo]);

  const onCloseDrawerHour = () => {
    if (errorPickTime) {
      setHourFrom('--:--');
      setHourTo('--:--');
    }

    setOpen(false);
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onCloseDrawerHour}
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
          <p className="text-xs">Define el rango de hora de salida</p>
          <span className="mt-4 flex items-center justify-center space-x-2 text-xl font-bold">
            <TimePicker time={hourFrom} setTime={setHourFrom} />
            <p> — </p>
            <TimePicker
              time={hourTo}
              setTime={setHourTo}
              error={errorPickTime}
            />
          </span>
          <span className="flex items-center justify-center text-xs text-red">
            {errorPickTime}
          </span>
        </div>
        <div className="my-5 flex flex-col items-center">
          {/* TODO: If there are errors, it should not let you filter */}
          <CTAButton className="w-11/12" text={'FILTRAR'} onClick={handleSearch}/>
        </div>
      </div>
    </Drawer>
  );
}
