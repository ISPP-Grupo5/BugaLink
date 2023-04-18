import { BackButton } from '@/components/buttons/Back';
import TripCard from '@/components/cards/recommendation';
import AnimatedLayout from '@/components/layouts/animated';
import TripCardSkeleton from '@/components/skeletons/TripCard';
import NEXT_ROUTES from '@/constants/nextRoutes';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { axiosAuth } from '@/lib/axios';
import FilterIcon from 'public/assets/filter-icon.svg';
import React, { useEffect, useState, useMemo } from 'react';
import Arrows from '/public/assets/arrows.svg';
import TargetPin from '/public/assets/map-mark.svg';
import SourcePin from '/public/assets/source-pin.svg';
import ThreeDots from '/public/assets/three-dots.svg';
import MagnifyingGlass from '/public/icons/Vista-Principal/glass.svg';
import SelectedUnselectedFilter from '@/components/search/selectedUnselectedFilters';
import { getGeocode, getLatLng } from 'use-places-autocomplete';
import PlacesAutocomplete from '@/components/maps/placesAutocomplete';
import { useLoadScript } from '@react-google-maps/api';
import InformativeCard from '@/components/cards/informative';

interface FormErrors {
  origin?: string;
  destination?: string;
}

export default function SearchResults() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [correctSearch, setCorrectSearch] = useState(false);
  const router = useRouter();
  const [origin, setOrigin] = useState(router.query.origin || '');
  const [destination, setDestination] = useState(router.query.destination || '');
  const [originCoords, setOriginCoords] = useState(undefined);
  const [destinationCoords, setDestinationCoords] = useState(undefined);
  const [hourFrom, setHourFrom] = useState(router.query.hour_from || '--:--');
  const [hourTo, setHourTo] = useState(router.query.hour_to || '--:--');
  const [dateFrom, setDateFrom] = useState(router.query.date_from || '');
  const [dateTo, setDateTo] = useState(router.query.date_to || '');
  const [prefersMusic, setPrefersMusic] = useState(router.query.prefers_music || '');
  const [prefersTalk, setPrefersTalk] = useState(router.query.prefers_talk || '');
  const [allowsPets, setAllowsPets] = useState(router.query.allows_pets || '');
  const [allowsSmoking, setAllowsSmoking] = useState(router.query.allows_smoking || '');
  const [minStars, setMinStars] = useState(router.query.min_stars || '');
  const [minPrice, setMinPrice] = useState(router.query.min_price || '');
  const [maxPrice, setMaxPrice] = useState(router.query.max_price || '');

  const filters = [
    {
      name: 'Precio',
      selected: minPrice !== '' || maxPrice !== '',
      minPrice: minPrice,
      maxPrice: maxPrice,
      setMinPrice: setMinPrice,
      setMaxPrice: setMaxPrice,
    },
    {
      name: 'Valoración',
      selected: minStars !== '',
      minStars: minStars,
    },
    {
      name: 'Hora',
      selected: hourFrom !== '--:--' || hourTo !== '--:--',
      hourFrom: hourFrom,
      hourTo: hourTo,
      setHourFrom: setHourFrom,
      setHourTo: setHourTo,
    },
    {
      name: 'Preferencias',
      selected: allowsSmoking || allowsPets || prefersMusic || prefersTalk,
      allowsSmoking: allowsSmoking,
      allowsPets: allowsPets,
      prefersMusic: prefersMusic,
      prefersTalk: prefersTalk,
      setAllowsSmoking: setAllowsSmoking,
      setAllowsPets: setAllowsPets,
      setPrefersMusic: setPrefersMusic,
      setPrefersTalk: setPrefersTalk,
    },
    {
      name: 'Día',
      selected: dateFrom !== '' || dateTo !== '',
      dateFrom: dateFrom,
      dateTo: dateTo,
      setDateFrom: setDateFrom,
      setDateTo: setDateTo,
    },
  ];

  const selectedFilters = filters.filter((filter) => filter.selected);
  const unselectedFilters = filters.filter((filter) => !filter.selected);

  // TODO: remove this block once the API is integrated, it's to simulate the loading of the results
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      // setSearchResults(searchResultsMock);
      setIsLoading(false);
      setIsError(false);
    }, 1000);
  });

  useEffect(() => {
    setMinPrice(router.query.min_price || '');
    setMaxPrice(router.query.max_price || '');
  }, [router.query.min_price, router.query.max_price]);

  useEffect(() => {
    setHourFrom(router.query.hour_from || '--:--');
    setHourTo(router.query.hour_to || '--:--');
  }, [router.query.hour_from, router.query.hour_to]);

  useEffect(() => {
    setDateFrom(router.query.date_from || '');
    setDateTo(router.query.date_to || '');
  }, [router.query.date_from, router.query.date_to]);

  useEffect(() => {
    setMinStars(router.query.min_stars || '');
  }, [router.query.min_stars]);

  useEffect(() => {
    setAllowsPets(router.query.allows_pets || '');
    setAllowsSmoking(router.query.allows_smoking || '');
    setPrefersMusic(router.query.prefers_music || '');
    setPrefersTalk(router.query.prefers_talk || '');
  }, [
    router.query.prefers_music,
    router.query.prefers_talk,
    router.query.allows_pets,
    router.query.allows_smoking,
  ]);

  // const handleArrowsClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
  //   console.log(origin)
  //   setDestination(origin);
  //   setOrigin(destination);
  // }

  const handleSearch = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCorrectSearch(false);
    // router.push({
    //   pathname: '/search/result',
    //   query: {
    //     origin: originCoords.lat.toString() + ',' + originCoords.lng.toString(),
    //     destination:
    //       destinationCoords.lat.toString() +
    //       ',' +
    //       destinationCoords.lng.toString(),
    //   },
    // });
    const errors: FormErrors = {};

    if (origin == '') {
      errors.origin = 'Por favor, ingrese una dirección de origen';
    }

    if (destination == '') {
      errors.destination = 'Por favor, ingrese una dirección de destino';
    }

    if (origin && destination) {
      if (origin === destination) {
        errors.origin = 'El origen y el destino no pueden ser iguales';
      }
    }

    setErrors(errors)

    if (Object.keys(errors).length === 0) {
      axiosAuth
        .get('/trips/search', {
          params: {
            origin:
              originCoords.lat.toString() + ',' + originCoords.lng.toString(),
            destination:
              destinationCoords.lat.toString() +
              ',' +
              destinationCoords.lng.toString(),
            date_from: dateFrom,
            date_to: dateTo,
            min_price: minPrice,
            max_price: maxPrice,
            hour_from: hourFrom == '--:--' ? '' : hourFrom,
            hour_to: hourTo == '--:--' ? '' : hourTo,
            allows_smoke:allowsSmoking,
            allows_pets:allowsPets,
            prefers_music:prefersMusic,
            prefers_talk: prefersTalk,
          },
        })
        .then((response) => {
          setSearchResults(response.data);
          setCorrectSearch(true)
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const libraries = useMemo(() => ['places'], []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

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
            <PlacesAutocomplete
              onAddressSelect={(address) => {
                getGeocode({ address: address }).then((results) => {
                  setOrigin(results[0].formatted_address);
                  setOriginCoords(getLatLng(results[0]));
                });
              }}
              placeholder="Desde"
              name="origin"
              error={errors.origin}
              // defaultValue={origin}
            />
          </div>

          {/* <Arrows className="text-gray" onClick={handleArrowsClick} /> */}
          <div></div>
          <div className="col-span-6 w-full pr-4">
            <PlacesAutocomplete
              onAddressSelect={(address) => {
                getGeocode({ address: address }).then((results) => {
                  setDestination(results[0].formatted_address);
                  setDestinationCoords(getLatLng(results[0]));
                });
              }}
              placeholder="Hasta"
              name="destination"
              error={errors.destination}
            />
          </div>
          <MagnifyingGlass
            className="cursor-pointer text-gray"
            onClick={handleSearch}
          />
        </div>
        <hr className="mt-4 w-full text-border-color" />
      </div>
      <div className="sticky top-0 z--10 rounded-b-3xl bg-white pl-2 pt-4 pb-2 shadow-md">
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
        <div className="flex justify-center mt-2">
          {correctSearch && <p className="text-lg font-thin text-green">La búsqueda se ha realizado correctamente</p>}
        </div>
        <div className="flex justify-center py-2">
          <p className="text-sm font-thin text-gray">
            Hay {searchResults.length} resultados que coinciden con tu búsqueda
          </p>
        </div>
      </div>
      <div className="divide-y-2 divide-light-gray">
        {isLoading || isError ? (
          [1, 2, 3, 4, 5].map((i) => (
            <TripCardSkeleton
              key={i}
              className="rounded-md bg-white outline outline-1 outline-light-gray"
            />
          ))
        ) : searchResults.length == 0 ? (
          <InformativeCard className="mt-5">
            No se han encontrado viajes
          </InformativeCard>
        ) : (
          searchResults.map((trip) => (
            <Link
              key={trip.name}
              href="/ride/V1StGXR8_Z5jdHi6B-myT/details?requested=false"
              className="w-full"
            >
              <TripCard
                key={trip.id}
                type="driver"
                name={`${trip.driver.user.first_name} ${trip.driver.user.last_name}`}
                avatar={trip.driver.user.photo}
                origin={trip.driver_routine.origin.address}
                destination={trip.driver_routine.destination.address}
                date={trip.departure_datetime}
                price={trip.driver_routine.price}
                className="rounded-md bg-white outline outline-1 outline-light-gray"
                href={NEXT_ROUTES.TRIP_DETAILS(trip.id)}
              />
            </Link>
          ))
        )}
      </div>
    </AnimatedLayout>
  );
}
