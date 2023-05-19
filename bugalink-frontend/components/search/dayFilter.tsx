import CTAButton from '@/components/buttons/CTA';
import { Drawer } from '@mui/material';
import { useState } from 'react';
import TagsButton from '../buttons/Tags';
import { WEEK_DAYS } from '@/constants/weekDays';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  days: string;
  setDays: (value: string) => void;
};

export default function DayFilter({
  open,
  setOpen,
  days, // Mon,Tue,Fri
  setDays,
}: Props) {
  const options = WEEK_DAYS;
  const [daysProvisional, setDaysProvisional] = useState(days.split(','));

  const handleApplyFilters = () => {
    setDays(daysProvisional.join(','));
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
          <p className="font-lato text-xl font-bold">Día de la semana</p>
          <p className="text-xs">Indica qué días quieres viajar</p>
          <span className="mt-4 flex flex-wrap space-x-2 text-xl">
            {Object.entries(options).map(([short, spanish]) => (
              <div
                key={short}
                onClick={() => {
                  // If the option is already selected, set it to 0
                  const isSelected = daysProvisional.includes(short);
                  if (isSelected) {
                    setDaysProvisional(
                      daysProvisional.filter((day) => day !== short)
                    );
                  } else {
                    setDaysProvisional([...daysProvisional, short]);
                  }
                }}
              >
                <TagsButton
                  text={spanish}
                  selected={daysProvisional.includes(short)}
                  className="mb-2 w-min"
                  ratingOptions
                />
              </div>
            ))}
          </span>
        </div>
        <div className="my-3 mb-5 flex flex-col items-center">
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
