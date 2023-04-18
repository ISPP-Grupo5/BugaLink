import CTAButton from '@/components/buttons/CTA';
import { Drawer } from '@mui/material';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  dateFrom?: string;
  setDateFrom: (value: string) => void;
  dateTo?: string;
  setDateTo: (value: string) => void;
};

export default function DateFilter({
  open,
  setOpen,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}: Props) {
  const [dateFromProvisional, setDateFromProvisional] = useState(
    dayjs(dateFrom)
  );
  const [dateToProvisional, setDateToProvisional] = useState(dayjs(dateTo));
  const [errorPickDate, setErrorPickDate] = useState<string | null>();

  useEffect(() => {
    if (dateFromProvisional && dateToProvisional) {
      if (dateFromProvisional.isAfter(dateToProvisional)) {
        setErrorPickDate(
          'La fecha de fin debe ser mayor que la fecha de inicio'
        );
      } else {
        setErrorPickDate(null);
      }
    }
  }, [dateFromProvisional, dateToProvisional]);

  const handleApplyFilters = () => {
    if (!dateFromProvisional || !dateToProvisional) {
      setErrorPickDate('Debes seleccionar ambas fechas');
      return;
    }
    if (errorPickDate) return;
    // TODO: fix bug, when setting a day it sets in the day before
    // Probably because we are in Spain (GMT +2 with the summer timezone)
    // and the dateTime is using 00:00:00, so when we trim the time,
    // it stays in the previous day
    // The current workaround is to add 12 hours but it's not the optimal solution
    dateFromProvisional &&
      setDateFrom(
        dateFromProvisional.add(12, 'hours').toISOString().split('T')[0]
      );
    dateToProvisional &&
      setDateTo(dateToProvisional.add(12, 'hours').toISOString().split('T')[0]);
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
          <p className="font-lato text-xl font-bold">Día</p>
          <p className="mb-6 text-sm">En base al día en el que deseas viajar</p>
          <span className="mt-4 grid grid-cols-2 items-center justify-center gap-y-3 gap-x-3 text-xl">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* pasa los valores de los estados como las propiedades value de los MobileDatePicker */}
              <MobileDatePicker
                label="Desde"
                value={dateFromProvisional}
                onChange={(newValue) => setDateFromProvisional(newValue)}
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
                value={dateToProvisional}
                onChange={(newValue) => setDateToProvisional(newValue)}
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
          <span className="mt-1 flex items-center justify-center text-sm text-red">
            {errorPickDate}
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
