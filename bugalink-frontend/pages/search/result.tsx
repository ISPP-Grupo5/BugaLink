import { BackButton } from '@/components/buttons/Back';
import TripCard from '@/components/cards/recommendation';
import AnimatedLayout from '@/components/layouts/animated';
import TripCardSkeleton from '@/components/skeletons/TripCard';
import NEXT_ROUTES from '@/constants/nextRoutes';
import Link from 'next/link';
import FilterIcon from 'public/assets/filter-icon.svg';
import React, { useEffect, useState } from 'react';
import Arrows from '/public/assets/arrows.svg';
import TargetPin from '/public/assets/map-mark.svg';
import SourcePin from '/public/assets/source-pin.svg';
import ThreeDots from '/public/assets/three-dots.svg';
import MagnifyingGlass from '/public/icons/Vista-Principal/glass.svg';
import SelectedUnselectedFilter from '@/components/search/selectedUnselectedFilters';

// TODO: Replace with data from the backend
const filters = [
  {
    name: 'Precio',
    selected: false,
    selectedValue: '2,00€ — 5,00€',
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
  {
    name: 'Preferencias',
    selected: false,
    selectedValue: '',
  },
  {
    name: 'Día',
    selected: false,
    selectedValue: 'Día',
  },
];

const selectedFilters = filters.filter((filter) => filter.selected);
const unselectedFilters = filters.filter((filter) => !filter.selected);

// TODO: Replace with data from the mock backend
const searchResultsMock = [
  {
    type: 'driver',
    rating: 4.6,
    name: 'Paco Perez',
    avatar: '/assets/anonymous-avatar.png',
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
    origin: 'Avenida Andalucía, Dos Hermanas',
    destination: 'La Motilla',
    date: '11 de Marzo de 2023, 17:30',
    price: 1.5,
  },
  {
    type: 'driver',
    rating: 4.7,
    name: 'Alberto Chicote',
    avatar: '/assets/anonymous-avatar.png',
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
    origin: 'La Cartuja',
    destination: 'Facultad de Psicología',
    date: '14 de Marzo de 2023: 7:30',
    price: 2.0,
  },
];

export default function SearchResults() {
  // TODO: remove this block once the API is integrated, it's to simulate the loading of the results
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setSearchResults(searchResultsMock);
      setIsLoading(false);
      setIsError(false);
    }, 1000);
  });

  return (
    <AnimatedLayout className="flex flex-col overflow-y-scroll bg-white">
      <div className="z-50 bg-white pt-4">
        <div className="grid grid-cols-9 grid-rows-2 place-content-center place-items-center gap-y-2 px-2">
          <BackButton className="bg-white" />
          <div className="justify-between row-span-2 flex h-full w-full flex-col items-center py-4 text-turquoise">
            <SourcePin className="h-5 w-5 flex-none" />
            <ThreeDots className="w-5 flex-none" />
            <TargetPin className="h-5 w-5 flex-none" />
          </div>
          <div className="col-span-6 w-full pr-4">
            <input
              type="search"
              placeholder="¿Desde dónde quieres ir?"
              value="Casa"
              className="ml-2 mr-2 w-full rounded-full bg-base-origin p-4 text-sm"
            ></input>
          </div>
          <Arrows className="text-gray" />
          <div></div>
          <div className="col-span-6 w-full pr-4">
            <input
              type="search"
              placeholder="Hasta dónde quieres ir?"
              value="Avenida Reina Mercedes"
              className="ml-2 mr-2 w-full rounded-full bg-base-origin p-4 text-sm"
            ></input>
          </div>
          <MagnifyingGlass className="text-gray" />
        </div>
        <hr className="mt-4 w-full text-border-color" />
      </div>
      <div className="sticky top-0 z-50 rounded-b-3xl bg-white pl-2 pt-4 pb-2 shadow-md">
        <div className="flex items-center space-x-2 overflow-x-scroll pr-2">
          <FilterIcon className="flex-none" />
          {selectedFilters.map((filter) => (
            <SelectedUnselectedFilter filter={filter} />
          ))}
          <div className="h-8 w-[0.05rem] flex-none bg-border-color" />
          {unselectedFilters.map((filter) => (
            <SelectedUnselectedFilter filter={filter} />
          ))}
        </div>
        <div className="flex justify-center py-2">
          <p className="text-xs font-thin text-gray">
            Hay 4 resultados que coinciden con tu búsqueda
          </p>
        </div>
      </div>
      <div className="divide-y-2 divide-light-gray">
        {isLoading || isError
          ? [1, 2, 3, 4, 5].map((i) => (
              <TripCardSkeleton
                key={i}
                className="rounded-md bg-white outline outline-1 outline-light-gray"
              />
            ))
          : searchResults.map((trip) => (
              <Link
                key={trip.name}
                href="/ride/V1StGXR8_Z5jdHi6B-myT/details?requested=false"
                className="w-full"
              >
                <TripCard
                  key={trip.name}
                  type={trip.type}
                  rating={trip.rating}
                  name={trip.name}
                  avatar={trip.avatar}
                  origin={trip.origin}
                  destination={trip.destination}
                  date={trip.date}
                  price={trip.price}
                  className="rounded-md bg-white outline outline-1 outline-light-gray"
                  href={NEXT_ROUTES.TRIP_DETAILS(trip.id)}
                />
              </Link>
            ))}
      </div>
    </AnimatedLayout>
  );
}
