import { BackButton } from '../../components/buttons/Back';
import SourcePin from '/public/assets/source-pin.svg';
import TargetPin from '/public/assets/map-mark.svg';
import ThreeDots from '/public/assets/three-dots.svg';
import Arrows from '/public/assets/arrows.svg';
import FilterIcon from 'public/assets/filter-icon.svg';
import AnimatedLayout from '../../components/layouts/animated';
import TagsButton from '../../components/buttons/Tags';
import TripCard from '../../components/cards/recommendation';
import { useState } from 'react';
import { Drawer } from '@mui/material';
import CTAButton from '../../components/buttons/CTA';
import TimePicker from '../../components/forms/TimePicker';
import Slider from '@mui/material/Slider';
import React from 'react';

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

export default function SearchResults() {
  const [drawerHour, setDrawerHour] = useState(false);
  const [drawerRating, setDrawerRating] = useState(false);
  const [drawerPrice, setDrawerPrice] = useState(false);
  const [pickTimeFrom, setPickTimeFrom] = useState('16:00');
  const [pickTimeTo, setPickTimeTo] = useState('16:15');
  const [values, setValues] = React.useState<number[]>([0, 2]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValues(newValue as number[]);
  };

  const selectedFilters = filters.filter((filter) => filter.selected);
  const unselectedFilters = filters.filter((filter) => !filter.selected);

  return (
    <AnimatedLayout className="flex flex-col bg-white overflow-y-scroll">
      <div className="pt-4 bg-white z-50">
        <div className="grid grid-cols-9 grid-rows-2 place-items-center place-content-center gap-y-2 px-2">
          <BackButton className="bg-white" />
          <div className="h-full w-full flex flex-col items-center justify-between py-4 row-span-2 text-turquoise">
            <SourcePin className="flex-none w-5 h-5" />
            <ThreeDots className="flex-none w-5" />
            <TargetPin className="flex-none w-5 h-5" />
          </div>
          <div className="col-span-6 pr-4 w-full">
            <input
              type="search"
              placeholder="Desde dónde quieres ir?"
              value="Casa"
              className="w-full text-sm rounded-full ml-2 bg-baseOrigin p-4 mr-2"
            ></input>
          </div>
          <div></div>
          <div></div>
          <div className="col-span-6 pr-4 w-full">
            <input
              type="search"
              placeholder="Hasta dónde quieres ir?"
              value="Avenida Reina Mercedes"
              className="w-full text-sm rounded-full ml-2 bg-baseOrigin p-4 mr-2"
            ></input>
          </div>
          <Arrows />
        </div>
        <hr className="mt-4 w-full text-border-color" />
      </div>
      <div className="rounded-b-3xl sticky top-0 shadow-md pl-2 pt-4 pb-2 bg-white z-50">
        <div className="items-center flex space-x-2 overflow-x-scroll pr-2">
          <FilterIcon className="flex-none" />
          {selectedFilters.map(
            (filter) =>
              (filter.name === 'Precio' && (
                <div onClick={() => setDrawerPrice(true)}>
                  <TagsButton text={filter.selectedValue + '⏷'} selected />
                </div>
              )) ||
              (filter.name === 'Hora' && (
                <div onClick={() => setDrawerHour(true)}>
                  <TagsButton text={filter.selectedValue + '⏷'} selected />
                </div>
              )) ||
              (filter.name === 'Valoración' && (
                <div onClick={() => setDrawerRating(true)}>
                  <TagsButton text={filter.selectedValue + '⏷'} selected />
                </div>
              ))
          )}
          <div className="flex-none h-8 w-[0.05rem] bg-border-color" />
          {unselectedFilters.map(
            (filter) =>
              (filter.name === 'Precio' && (
                <div onClick={() => setDrawerPrice(true)}>
                  <TagsButton text={filter.name + '⏷'} />
                </div>
              )) ||
              (filter.name === 'Hora' && (
                <div onClick={() => setDrawerHour(true)}>
                  <TagsButton text={filter.name + '⏷'} />
                </div>
              )) ||
              (filter.name === 'Valoración' && (
                <div onClick={() => setDrawerRating(true)}>
                  <TagsButton text={filter.name + '⏷'} />
                </div>
              ))
          )}
        </div>
        <div className="flex justify-center py-2">
          <p className="text-xs text-grey font-thin">
            Hay 4 resultados que coinciden con tu búsqueda
          </p>
        </div>
      </div>
      <div className="divide-y-2 divide-light-gray">
        {searchResults.map((trip) => (
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
          />
        ))}
      </div>

      <Drawer
        anchor="bottom"
        open={drawerHour}
        onClose={() => setDrawerHour(false)}
        style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}
      >
        <div className="ml-6 mt-2">
          <p className="font-lato font-bold text-xl">Hora de salida</p>
          <p className="text-xs">Define el rango de hora de salida</p>
          <span className="mt-4 flex items-center justify-center space-x-2 text-xl font-bold">
            <TimePicker time={pickTimeFrom} setTime={setPickTimeFrom} />
            <p> - </p>
            <TimePicker time={pickTimeTo} setTime={setPickTimeTo} />
          </span>
        </div>
        <div className="flex flex-col items-center my-5">
          <CTAButton className="w-11/12" text={'FILTRAR'} />
        </div>
      </Drawer>

      <Drawer
        id="drawerPrice"
        anchor="bottom"
        open={drawerPrice}
        onClose={() => setDrawerPrice(false)}
      >
        <div className="ml-6 mt-2 mr-5">
          <p className="font-lato font-bold text-xl">Precio</p>
          <p className="text-xs">Define tu presupuesto por trayecto</p>
          <p className="font-lato mt-4 font-bold">
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
        <div className="flex flex-col items-center my-5">
          <CTAButton className="w-11/12" text={'FILTRAR'} />
        </div>
      </Drawer>

      <Drawer
        anchor="bottom"
        open={drawerRating}
        onClose={() => setDrawerRating(false)}
      >
        <div className="ml-6 mt-2 mr-5">
          <p className="font-lato font-bold text-xl">Valoraciones</p>
          <p className="text-xs">En base a la opinión de otros usuarios</p>
          <span className="mt-4 grid grid-cols-2 items-center justify-center gap-y-3 gap-x-3 text-xl">
            <TagsButton text="Más de 4 ⭐️" selected />
            <TagsButton text="Más de 3 ⭐️" />
            <TagsButton text="Más de 2 ⭐️" />
            <TagsButton text="Más de 1 ⭐️" />
          </span>
        </div>
        <div className="flex flex-col items-center my-5">
          <CTAButton className="w-11/12" text={'FILTRAR'} />
        </div>
      </Drawer>
    </AnimatedLayout>
  );
}
