import CTAButton from '@/components/buttons/CTA';
import { Drawer } from '@mui/material';
import React, { useState } from 'react';
import Slider from '@mui/material/Slider';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function PriceFilter({ open, setOpen }: Props) {
  const [priceRange, setPriceRange] = useState<number[]>([0, 0]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  function valuetext(value: number) {
    return `${value}°C`;
  }

  return (
    <Drawer
      id="drawerPrice"
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
          <p className="font-lato text-xl font-bold">Precio</p>
          <p className="text-xs">Define tu presupuesto por trayecto</p>
          <p className="mt-4 font-lato font-bold">
            {priceRange[0]}€ — {priceRange[1]}€{' '}
          </p>
          <div className="mt-2 flex items-center justify-center space-x-2 text-xl">
            <Slider
              getAriaLabel={() => 'Price range range'}
              value={priceRange}
              onChange={handleChange}
              valueLabelDisplay="auto"
              getAriaValueText={valuetext}
              min={0}
              max={50}
              sx={{
                width: 300,
                color: '#38a3a5',
              }}
            />
          </div>
        </div>
        <div className="my-5 flex flex-col items-center">
          <CTAButton className="w-11/12" text={'FILTRAR'} />
        </div>
      </div>
    </Drawer>
  );
}
