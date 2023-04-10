import TimePicker from '@/components/forms/TimePicker';
import CTAButton from '@/components/buttons/CTA';
import { Drawer } from '@mui/material';
import React, { useState } from 'react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function HourFilter({ open, setOpen }: Props) {
  const [pickTimeFrom, setPickTimeFrom] = useState('--:--');
  const [pickTimeTo, setPickTimeTo] = useState('--:--');

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
          <p className="text-xs">Define el rango de hora de salida</p>
          <span className="mt-4 flex items-center justify-center space-x-2 text-xl font-bold">
            <TimePicker time={pickTimeFrom} setTime={setPickTimeFrom} />
            <p> — </p>
            <TimePicker time={pickTimeTo} setTime={setPickTimeTo} />
          </span>
        </div>
        <div className="my-5 flex flex-col items-center">
          <CTAButton className="w-11/12" text={'FILTRAR'} />
        </div>
      </div>
    </Drawer>
  );
}