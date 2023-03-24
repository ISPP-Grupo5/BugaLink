import { Drawer } from '@mui/material';
import Slider from '@mui/material/Slider';
import Link from 'next/link';
import FilterIcon from 'public/assets/filter-icon.svg';
import React, { useState } from 'react';
import { BackButton } from '@/components/buttons/Back';
import CTAButton from '@/components/buttons/CTA';
import TagsButton from '@/components/buttons/Tags';
import { TripCard } from '@/components/cards/recommendation';
import TimePicker from '@/components/forms/TimePicker';
import AnimatedLayout from '@/components/layouts/animated';
import Arrows from '/public/assets/arrows.svg';
import TargetPin from '/public/assets/map-mark.svg';
import SourcePin from '/public/assets/source-pin.svg';
import ThreeDots from '/public/assets/three-dots.svg';

const filters = [
  {
    name: 'Precio',
    selected: false,
    selectedValue: '2,00€ - 5,00€',
  },
  {
    name: 'Valoración',
    selected: true,
    selectedValue: 'Más de 4 ⭐️',
  },
  {
    name: 'Hora',
    selected: false,
    selectedValue: '9:00 AM',
  },
];

// TODO: Replace with data from the mock backend
const searchResults = [
  {
    type: 'driver',
    rating: 4.6,
    name: 'Paco Perez',
    avatar: '/assets/avatar.png',
    gender: 'M',
    origin: 'Centro Comercial Way',
    destination: 'ETSII',
    date: '14 de Marzo de 2023, 12:00',
    price: 2,
  },
  {
    type: 'driver',
    rating: 4.7,
    name: 'Josefina Mayo',
    avatar: '/assets/avatar.svg',
    gender: 'F',
    origin: 'Avenida Andalucía, Dos Hermanas',
    destination: 'La Motilla',
    date: '11 de Marzo de 2023, 17:30',
    price: 1.5,
  },
  {
    type: 'driver',
    rating: 4.7,
    name: 'Alberto Chicote',
    avatar: '/assets/avatar.png',
    gender: 'M',
    origin: 'Centro Comercial Lagoh',
    destination: 'Isla Mágica',
    date: '17 de Marzo de 2023, 11:40',
    price: 1.75,
  },
  {
    type: 'driver',
    rating: 4.7,
    name: 'Laura Laureada',
    avatar: '/assets/avatar.svg',
    gender: 'F',
    origin: 'La Cartuja',
    destination: 'Facultad de Psicología',
    date: '14 de Marzo de 2023: 7:30',
    price: 2.0,
  },
];

function valuetext(value: number) {
  return `${value}°C`;
}

// TODO: reduce this view's complexity
export default function SearchResults() {
  const [drawerHour, setDrawerHour] = useState(false);
  const [drawerRating, setDrawerRating] = useState(false);
  const [drawerPrice, setDrawerPrice] = useState(false);
  const [pickTimeFrom, setPickTimeFrom] = useState('16:00');
  const [pickTimeTo, setPickTimeTo] = useState('16:15');
  const [values, setValues] = React.useState<number[]>([0, 2]);
  // TODO: use more meaningful variable names. I suppose "values" is about the price range.
  // Better to define 2 states for that (minPrice, maxPrice) and use them in the slider.
  // Ideally we would have each filter contained in its own file, and this page would
  // only contain the logic to render the filters and the results

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValues(newValue as number[]);
  };

  const selectedFilters = filters.filter((filter) => filter.selected);
  const unselectedFilters = filters.filter((filter) => !filter.selected);

  return (
    <AnimatedLayout className="flex flex-col overflow-y-scroll bg-white">
      <div className="z-50 bg-white pt-4">
        <div className="grid grid-cols-9 grid-rows-2 place-content-center place-items-center gap-y-2 px-2">
          <BackButton className="bg-white" />
          <div className="row-span-2 flex h-full w-full flex-col items-center justify-between py-4 text-turquoise">
            <SourcePin className="h-5 w-5 flex-none" />
            <ThreeDots className="w-5 flex-none" />
            <TargetPin className="h-5 w-5 flex-none" />
          </div>
          <div className="col-span-6 w-full pr-4">
            <input
              type="search"
              placeholder="Desde dónde quieres ir?"
              value="Casa"
              className="ml-2 mr-2 w-full rounded-full bg-base-origin p-4 text-sm"
            ></input>
          </div>
          <div></div>
          <div></div>
          <div className="col-span-6 w-full pr-4">
            <input
              type="search"
              placeholder="Hasta dónde quieres ir?"
              value="Avenida Reina Mercedes"
              className="ml-2 mr-2 w-full rounded-full bg-base-origin p-4 text-sm"
            ></input>
          </div>
          <Arrows />
        </div>
        <hr className="mt-4 w-full text-border-color" />
      </div>
      <div className="sticky top-0 z-50 rounded-b-3xl bg-white pl-2 pt-4 pb-2 shadow-md">
        <div className="flex items-center space-x-2 overflow-x-scroll pr-2">
          <FilterIcon className="flex-none" />
          {selectedFilters.map(
            (filter) =>
              (filter.name === 'Precio' && (
                <div onClick={() => setDrawerPrice(true)}>
                  <TagsButton text={filter.selectedValue} selected />
                </div>
              )) ||
              (filter.name === 'Hora' && (
                <div onClick={() => setDrawerHour(true)}>
                  <TagsButton text={filter.selectedValue} selected />
                </div>
              )) ||
              (filter.name === 'Valoración' && (
                <div onClick={() => setDrawerRating(true)}>
                  <TagsButton text={filter.selectedValue} selected />
                </div>
              ))
          )}
          <div className="h-8 w-[0.05rem] flex-none bg-border-color" />
          {unselectedFilters.map(
            (filter) =>
              (filter.name === 'Precio' && (
                <div onClick={() => setDrawerPrice(true)}>
                  <TagsButton text={filter.name} />
                </div>
              )) ||
              (filter.name === 'Hora' && (
                <div onClick={() => setDrawerHour(true)}>
                  <TagsButton text={filter.name} />
                </div>
              )) ||
              (filter.name === 'Valoración' && (
                <div onClick={() => setDrawerRating(true)}>
                  <TagsButton text={filter.name} />
                </div>
              ))
          )}
        </div>
        <div className="flex justify-center py-2">
          <p className="text-xs font-thin text-gray">
            Hay 4 resultados que coinciden con tu búsqueda
          </p>
        </div>
      </div>
      <div className="divide-y-2 divide-light-gray">
        {searchResults.map((trip) => (
          <Link
            key={trip.name}
            href="/ride/V1StGXR8_Z5jdHi6B-myT/detailsOne?requested=false"
            className="w-full"
          >
            <TripCard
              key={trip.name}
              type={trip.type}
              rating={trip.rating}
              name={trip.name}
              gender={trip.gender}
              avatar={trip.avatar}
              origin={trip.origin}
              destination={trip.destination}
              date={trip.date}
              price={trip.price}
              className="rounded-md bg-white outline outline-1 outline-light-gray"
            />
          </Link>
        ))}
      </div>

      <Drawer
        anchor="bottom"
        open={drawerHour}
        onClose={() => setDrawerHour(false)}
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
              <p> - </p>
              <TimePicker time={pickTimeTo} setTime={setPickTimeTo} />
            </span>
          </div>
          <div className="my-5 flex flex-col items-center">
            <CTAButton className="w-11/12" text={'FILTRAR'} />
          </div>
        </div>
      </Drawer>

      <Drawer
        id="drawerPrice"
        anchor="bottom"
        open={drawerPrice}
        onClose={() => setDrawerPrice(false)}
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
              {values[0]}€ - {values[1]}€{' '}
            </p>
            <div className="mt-2 flex items-center justify-center space-x-2 text-xl">
              <Slider
                getAriaLabel={() => 'Price range range'}
                value={values}
                onChange={handleChange}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
                min={0}
                max={15}
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

      <Drawer
        anchor="bottom"
        open={drawerRating}
        onClose={() => setDrawerRating(false)}
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
              <TagsButton text="Más de 4 ⭐️" selected ratingOptions={true} />
              <TagsButton text="Más de 3 ⭐️" ratingOptions={true} />
              <TagsButton text="Más de 2 ⭐️" ratingOptions={true} />
              <TagsButton text="Más de 1 ⭐️" ratingOptions={true} />
            </span>
          </div>
          <div className="my-5 flex flex-col items-center">
            <CTAButton className="w-11/12" text={'FILTRAR'} />
          </div>
        </div>
      </Drawer>
    </AnimatedLayout>
  );
}
