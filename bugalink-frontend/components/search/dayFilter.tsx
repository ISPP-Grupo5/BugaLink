import CTAButton from '@/components/buttons/CTA';
import { Drawer } from '@mui/material';
import React, { useState } from 'react';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function DayFilter({ open, setOpen }: Props) {
  const [from, setFrom] = useState();
  const [to, setTo] = useState();

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
        <div className="ml-6 mt-2 mr-5">
          <p className="font-lato text-xl font-bold">Día</p>
          <p className="text-xs">En base al día en el que deseas viajar</p>
          <span className="mt-4 grid grid-cols-2 items-center justify-center gap-y-3 gap-x-3 text-xl">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* pasa los valores de los estados como las propiedades value de los MobileDatePicker */}
              <MobileDatePicker
                label="Desde"
                value={from}
                onChange={(newValue) => setFrom(newValue)}
                sx={{
                  fontFamily: 'Lato, sans-serif',
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                    {
                      borderColor: '#7cc3c4',
                    },
                  '& .MuiFormLabel-root.Mui-focused': {
                    color: '#7cc3c4',
                  },
                }}
              />
              <MobileDatePicker
                label="Hasta"
                value={to}
                onChange={(newValue) => setTo(newValue)}
                sx={{
                  fontFamily: 'Lato, sans-serif',
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                    {
                      borderColor: '#7cc3c4',
                    },
                  '& .MuiFormLabel-root.Mui-focused': {
                    color: '#7cc3c4',
                  },
                }}
              />
            </LocalizationProvider>
          </span>
        </div>
        <div className="my-5 flex flex-col items-center">
          <CTAButton className="w-11/12" text={'FILTRAR'} />
        </div>
      </div>
    </Drawer>
  );
}
