import CTAButton from '@/components/buttons/CTA';
import { Drawer } from '@mui/material';
import { useState } from 'react';
import TagsButton from '../buttons/Tags';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  minStars: number;
  setMinStars: (value: number) => void;
};

export default function RatingFilter({
  open,
  setOpen,
  minStars,
  setMinStars,
}: Props) {
  const options = [1, 2, 3, 4];
  const [minStarsProvisional, setMinStarsProvisional] = useState(minStars);

  const handleApplyFilters = () => {
    setMinStars(minStarsProvisional);
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
        <div className="ml-6 mt-2 mr-5">
          <p className="font-lato text-xl font-bold">Valoraciones</p>
          <p className="mb-6 text-sm">En base a la opinión de otros usuarios</p>
          <span className="mt-4 grid grid-cols-2 items-center justify-center gap-y-3 gap-x-3 text-xl">
            {options.map((option) => (
              <div
                key={option}
                onClick={() => {
                  // If the option is already selected, set it to 0
                  const isSelected =
                    minStarsProvisional?.toString() === option.toString();
                  setMinStarsProvisional(isSelected ? undefined : option);
                }}
              >
                <TagsButton
                  text={`Más de ${option} ⭐️`}
                  ratingOptions={true}
                  selected={
                    minStarsProvisional?.toString() === option.toString()
                  }
                  className="w-full"
                />
              </div>
            ))}
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
