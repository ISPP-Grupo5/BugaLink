
import CTAButton from '@/components/buttons/CTA';
import { Drawer } from '@mui/material';
import TagsButton from '../buttons/Tags';
import React, { useState } from 'react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function RatingFilter({ open, setOpen }: Props) {
    const [isRatingSelected4, setIsRatingSelected4] = useState(false);
    const [isRatingSelected3, setIsRatingSelected3] = useState(false);
    const [isRatingSelected2, setIsRatingSelected2] = useState(false);
    const [isRatingSelected1, setIsRatingSelected1] = useState(false);

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
          <p className="text-xs">En base a la opinión de otros usuarios</p>
          <span className="mt-4 grid grid-cols-2 items-center justify-center gap-y-3 gap-x-3 text-xl">
            <div onClick={() => setIsRatingSelected4(!isRatingSelected4)}>
              <TagsButton
                text="Más de 4 ⭐️"
                ratingOptions={true}
                selected={isRatingSelected4}
                className="w-full"
              />
            </div>
            <div onClick={() => setIsRatingSelected3(!isRatingSelected3)}>
              <TagsButton
                text="Más de 3 ⭐️"
                ratingOptions={true}
                selected={isRatingSelected3}
                className="w-full"
              />
            </div>
            <div onClick={() => setIsRatingSelected2(!isRatingSelected2)}>
              <TagsButton
                text="Más de 2 ⭐️"
                ratingOptions={true}
                selected={isRatingSelected2}
                className="w-full"
              />
            </div>
            <div onClick={() => setIsRatingSelected1(!isRatingSelected1)}>
              <TagsButton
                text="Más de 1 ⭐️"
                ratingOptions={true}
                selected={isRatingSelected1}
                className="w-full"
              />
            </div>
          </span>
        </div>
        <div className="my-5 flex flex-col items-center">
          <CTAButton className="w-11/12" text={'FILTRAR'} />
        </div>
      </div>
    </Drawer>
  );
}
