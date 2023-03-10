import { BackButton } from '../../components/buttons/Back';
import SourcePin from '/public/assets/source-pin.svg';
import TargetPin from '/public/assets/map-mark.svg';
import ThreeDots from '/public/assets/three-dots.svg';
import Arrows from '/public/assets/arrows.svg';
import FilterIcon from 'public/assets/filter-icon.svg';
import AnimatedLayout from '../../components/layouts/animated';
import TagsButton from '../../components/buttons/Tags';
import TripCard from '../../components/cards/recommendation';

const filters = [
  {
    name: 'Precio',
    selected: false,
    selectedValue: '2,00€ - 5,00€',
  },
  {
    name: 'Valoración',
    selected: true,
    selectedValue: 'Más de 4,5 ⭐️',
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
    avatar: '/assets/Avatar.png',
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
    avatar: '/assets/Avatar.png',
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

export default function SearchResults() {

  const selectedFilters = filters.filter((filter) => filter.selected);
  const unselectedFilters = filters.filter((filter) => !filter.selected);

  return (
    <AnimatedLayout className="flex flex-col bg-white overflow-y-scroll">
      <div className="pt-4 bg-white z-50">
        <div className="grid grid-cols-9 grid-rows-2 place-items-center place-content-center gap-y-2 px-2">
          <BackButton className="bg-white" />
          <div className="h-full w-full flex flex-col items-center justify-between py-4 row-span-2 text-lightTurquoise">
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
          {selectedFilters.map((filter) => (
            <TagsButton text={filter.selectedValue} selected />
          ))}
          <div className="flex-none h-8 w-[0.05rem] bg-border-color" />
          {unselectedFilters.map((filter) => (
            <TagsButton text={filter.name} />
          ))}
        </div>
        <div className="flex justify-center py-2">
          <p className="text-xs text-grey font-thin">
            Hay 4 resultados que coinciden con tu búsqueda
          </p>
        </div>
      </div>
      <div className="divide-y-2 divide-lightGray">
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
    </AnimatedLayout>
  );
}
