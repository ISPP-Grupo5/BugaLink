import { BackButton } from '@/components/buttons/Back';
import TagsButton from '@/components/buttons/Tags';
import TripCard from '@/components/cards/recommendation';
import AnimatedLayout from '@/components/layouts/animated';
import PlacesAutocomplete from '@/components/maps/placesAutocomplete';
import DateFilter from '@/components/search/dateFilter';
import DayFilter from '@/components/search/dayFilter';
import HourFilter from '@/components/search/hourFilter';
import PriceFilter from '@/components/search/priceFilter';
import RatingFilter from '@/components/search/ratingFilter';
import TripCardSkeleton from '@/components/skeletons/TripCard';
import NEXT_ROUTES from '@/constants/nextRoutes';
import { WEEK_DAYS_SHORT } from '@/constants/weekDays';
import usePosition from '@/hooks/usePosition';
import useTripSearch from '@/hooks/useTripSearch';
import { useLoadScript } from '@react-google-maps/api';
import Link from 'next/link';
import { useRouter } from 'next/router';
import FilterIcon from 'public/assets/filter-icon.svg';
import React, { useEffect, useMemo, useState } from 'react';
import { LatLng, getGeocode, getLatLng } from 'use-places-autocomplete';
import Arrows from '/public/assets/arrows.svg';
import TargetPin from '/public/assets/map-mark.svg';
import SourcePin from '/public/assets/source-pin.svg';
import ThreeDots from '/public/assets/three-dots.svg';
import MagnifyingGlass from '/public/icons/Vista-Principal/glass.svg';
import { shortenDate } from '@/utils/formatters';
import InformativeCard from '@/components/cards/informative';

type Filter = {
  name: string;
  drawer: React.FC<{ open: boolean; setOpen: (open: boolean) => void }>;
  props: any;
  selected: boolean;
  text: string;
};

const FilterPill = ({ filter }) => {
  // This function handles the logic for each filter pill
  const [openDrawer, setOpenDrawer] = useState(false);

  const f = filter as Filter;
  return (
    <div>
      <div
        className="flex-grow-1 flex-shrink-0"
        onClick={() => setOpenDrawer(true)}
      >
        <TagsButton text={f.selected ? f.text : f.name} selected={f.selected} />
      </div>
      <f.drawer open={openDrawer} setOpen={setOpenDrawer} {...f.props} />
    </div>
  );
};

export async function getServerSideProps(context) {
  // This is for getting the query params from the URL and setting them as default values
  // If we do it with getServersideProps, we are not going to find undefined values
  // since they come already defined in the request
  const origin = ((context.query.origin as string) || '0,0').split(',');
  const destination = ((context.query.destination as string) || '0,0').split(
    ','
  );
  const data = {
    originCoords: {
      lat: Number.parseFloat(origin[0]) || 0,
      lng: Number.parseFloat(origin[1]) || 0,
    },
    destinationCoords: {
      lat: Number.parseFloat(destination[0]) || 0,
      lng: Number.parseFloat(destination[1]) || 0,
    },
    originAddress: (context.query.originAddress as string) || 'Mi ubicación',
    destinationAddress: (context.query.destinationAddress as string) || '',
    hourFrom: (context.query.hourFrom as string) || '',
    hourTo: (context.query.hourTo as string) || '',
    dateFrom: (context.query.dateFrom as string) || '',
    dateTo: (context.query.dateTo as string) || '',
    days: (context.query.days as string) || '',
    minStars: (context.query.minStars as string) || '',
    minPrice: (context.query.minPrice as string) || '',
    maxPrice: (context.query.maxPrice as string) || '',
  };

  return {
    props: { data },
  };
}

export default function SearchResults({ data }) {
  const router = useRouter();

  const { position } = usePosition(); // User's location

  const [originAddress, setOriginAddress] = useState(data.originAddress);
  const [destinationAddress, setDestinationAddress] = useState(
    data.destinationAddress
  );
  const [originCoords, setOriginCoords] = useState<LatLng>(
    data.originCoords || position
  );
  const [destinationCoords, setDestinationCoords] = useState(
    data.destinationCoords
  );

  const [hourFrom, setHourFrom] = useState(data.hourFrom);
  const [hourTo, setHourTo] = useState(data.hourTo);

  const [dateFrom, setDateFrom] = useState(data.dateFrom);
  const [dateTo, setDateTo] = useState(data.dateTo);
  const [days, setDays] = useState(data.days);
  // const [prefersMusic, setPrefersMusic] = useState('');
  const [minStars, setMinStars] = useState(data.minStars);
  const [minPrice, setMinPrice] = useState(data.minPrice);
  const [maxPrice, setMaxPrice] = useState(data.maxPrice);

  const { trips, isLoading, isError } = useTripSearch(
    `${originCoords.lat},${originCoords.lng}`,
    `${destinationCoords.lat},${destinationCoords.lng}`,
    hourFrom,
    hourTo,
    dateFrom,
    dateTo,
    days,
    // prefersMusic,
    minStars,
    minPrice,
    maxPrice
  );
  // Initializing google maps API
  const libraries = useMemo(() => ['places'], []);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: libraries as any,
  });

  const handleSwapAddresses = () => {
    setOriginAddress(destinationAddress);
    setDestinationAddress(originAddress);
    setOriginCoords(destinationCoords);
    setDestinationCoords(originCoords);
    // Also set origin and destination coords
  };

  useEffect(() => {
    const urlParams = {
      origin: `${originCoords.lat},${originCoords.lng}`,
      destination: `${destinationCoords.lat},${destinationCoords.lng}`,
      originAddress,
      destinationAddress,
      minStars,
      minPrice,
      maxPrice,
      hourFrom,
      hourTo,
      days,
      dateFrom,
      dateTo,
    };
    // Shallow routing when any parameter changes

    // Don't include unselected params in the URL
    const truthyUrlParams = Object.fromEntries(
      Object.entries(urlParams).filter(([_, v]) => v)
    );

    router.replace(
      {
        pathname: NEXT_ROUTES.SEARCH_RESULTS,
        query: truthyUrlParams,
      },
      undefined,
      { shallow: false }
    );
  }, [
    originCoords,
    destinationCoords,
    minStars,
    minPrice,
    maxPrice,
    hourFrom,
    hourTo,
    days,
    dateFrom,
    dateTo,
  ]);

  // These filters get dynamically mapped to the filter pills
  // They contain the name, the condition to be shown as selected,
  // The props they need to pass their drawers and the reference
  // To their drawer component
  const filters = [
    {
      name: 'Precio',
      drawer: PriceFilter,
      props: {
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
      },
      selected: minPrice || maxPrice,
      text: `${minPrice || '0'}€ — ${maxPrice || '∞'}€`,
    },
    {
      name: 'Valoración',
      drawer: RatingFilter,
      props: {
        minStars,
        setMinStars,
      },
      selected: minStars,
      text: `Más de ${minStars} ⭐️`,
    },
    {
      name: 'Hora',
      drawer: HourFilter,
      props: {
        hourFrom,
        setHourFrom,
        hourTo,
        setHourTo,
      },
      selected: hourFrom || hourTo,
      text: `${hourFrom || '0:00'} — ${hourTo || '23:59'}`,
    },
    {
      name: 'Días',
      drawer: DayFilter,
      props: {
        days,
        setDays,
      },
      selected: days,
      text: Object.keys(WEEK_DAYS_SHORT)
        .reduce((acc, day) => {
          if (days.includes(day)) {
            acc.push(WEEK_DAYS_SHORT[day]);
          }
          return acc;
        }, [] as string[])
        .join(', '),
    },
    {
      name: 'Fecha',
      drawer: DateFilter,
      props: {
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
      },
      selected: dateFrom || dateTo,
      text: `${dateFrom ? shortenDate(dateFrom) : 'Hasta'} — ${
        dateTo ? shortenDate(dateTo) : 'Hoy'
      }`,
    },
  ];

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
          {isLoaded && (
            <>
              <PlacesAutocomplete
                onAddressSelect={(address) => {
                  // delete errors.origin;
                  getGeocode({ address: address }).then((results) => {
                    setOriginAddress(results[0].formatted_address);
                    setOriginCoords(getLatLng(results[0]));
                  });
                }}
                className="col-span-6 w-full pr-4"
                placeholder="¿Desde dónde quieres ir?"
                defaultValue={originAddress}
                isSearch
              />
              <Arrows
                className="cursor-pointer text-gray"
                onClick={handleSwapAddresses}
              />
              <div></div>
              <PlacesAutocomplete
                onAddressSelect={(address) => {
                  // delete errors.origin;
                  getGeocode({ address: address }).then((results) => {
                    setDestinationAddress(results[0].formatted_address);
                    setDestinationCoords(getLatLng(results[0]));
                  });
                }}
                className="col-span-6 w-full pr-4"
                placeholder="Hasta dónde quieres ir?"
                defaultValue={destinationAddress}
                name="abc"
                isSearch
              />
            </>
          )}
          <MagnifyingGlass
            className="cursor-pointer text-gray"
            onClick={router.reload}
          />
        </div>
        <hr className="mt-4 w-full text-border-color" />
      </div>
      <div className="sticky top-0 z-10 rounded-b-3xl bg-white pl-2 pt-4 pb-2 shadow-md">
        <div className="flex items-center space-x-2 overflow-x-scroll py-1 pr-2">
          <FilterIcon className="flex-none" />
          {selectedFilters.map((filter) => (
            <FilterPill key={filter.name} filter={filter} />
          ))}
          <div className="h-8 w-[0.05rem] flex-none bg-border-color" />
          {unselectedFilters.map((filter) => (
            <FilterPill key={filter.name} filter={filter} />
          ))}
        </div>
        <div className="flex justify-center py-2">
          {trips && (
            <p className="text-md font-thin text-gray">
              Hay {trips.length} resultados que coinciden con tu búsqueda
            </p>
          )}
        </div>
      </div>
      <div className="divide-y-2 divide-light-gray">
        {isLoading &&
          [1, 2, 3, 4, 5].map((i) => (
            <TripCardSkeleton
              key={i}
              className="rounded-md bg-white outline outline-1 outline-light-gray"
            />
          ))}
        {trips &&
          trips.map((trip) => (
            <Link
              key={trip.id}
              href={NEXT_ROUTES.TRIP_DETAILS(trip.id)}
              className="w-full"
            >
              <TripCard
                type="driver"
                name={`${trip.driver.user.first_name} ${trip.driver.user.last_name}`}
                avatar={trip.driver.user.photo}
                origin={trip.driver_routine.origin.address}
                destination={trip.driver_routine.destination.address}
                date={trip.departure_datetime}
                price={Number.parseFloat(trip.driver_routine.price)}
                className="rounded-md bg-white outline outline-1 outline-light-gray"
                href={NEXT_ROUTES.TRIP_DETAILS(trip.id)}
              />
            </Link>
          ))}
        {(isError || !originCoords || !destinationCoords) && (
          <InformativeCard className="mt-4 text-xl">
            Selecciona un origen y un destino y empezarás a ver resultados de
            búsquedas
          </InformativeCard>
        )}
      </div>
    </AnimatedLayout>
  );
}
