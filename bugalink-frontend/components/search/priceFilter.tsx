import CTAButton from '@/components/buttons/CTA';
import { Drawer } from '@mui/material';
import Slider from '@mui/material/Slider';
import { useState } from 'react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  minPrice: number;
  maxPrice: number;
  setMinPrice: (value: number) => void;
  setMaxPrice: (value: number) => void;
};

export default function PriceFilter({
  open,
  setOpen,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
}: Props) {
  const [priceRange, setPriceRange] = useState<number[]>([minPrice, maxPrice]);
  const handleChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleApplyFilters = () => {
    setMinPrice(priceRange[0]);
    setMaxPrice(priceRange[1]);
    setOpen(false);
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
          <p className="mb-6 text-sm">Define tu presupuesto por trayecto</p>
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
