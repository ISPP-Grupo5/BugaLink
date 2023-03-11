import TripCard from '../components/cards/recommendation';

const trips = [
  {
    tipo: 'Conductora',
    valoracion: '4.9',
    name: 'María Teresa Romero',
    avatar: '../../public/assets/avatar.svg',
    origin: 'Centro comercial Way',
    destination: 'Centro comercial Lagoh',
    date: 'Todos los Martes, 8:00',
    price: '2,00€',
  },
  {
    tipo: 'Conductor',
    valoracion: '4.6',
    name: 'Francisco Javier Vázquez',
    avatar: '../../public/assets/avatar.svg',
    origin: 'Carrefour Dos Hermanas',
    destination: 'Parking CC. Lagoh',
    date: 'Todos los Martes, 8:05',
    price: '2,00€',
  },
  {
    tipo: 'Conductor',
    valoracion: '4.8',
    name: 'Jesús Marchena',
    avatar: '../../public/assets/avatar.svg',
    origin: 'Escuela Técnica Superior de Ingeniería Informática',
    destination: 'Avda. de Andalucía, 35',
    date: 'Todos los Lunes, 21:00',
    price: '1,50€',
  },
];

type props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function TripList({ open, setOpen }: props) {
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div className="bg-white">
      <div
        className={`absolute -top-20 rounded-t-xl bg-white w-full visible right-0 left-0`}
        onClick={() => setOpen(true)}
      >
        <div className="ml-4 mt-4">
          <div className="w-7 h-1.5 bg-light-gray rounded-lg absolute top-2 left-1/2 transform -translate-x-1/2"></div>
          <p className="font-lato font-semibold text-3xl">Recomendaciones</p>
          <p className="font-lato font-thin text-base text-gray mb-5 leading-3">
            En base a tu horario sin cubrir
          </p>
        </div>
      </div>
      <div className="trip-list grid justify-items-center mt-6 h-full overflow-auto">
        {trips.map((trip) => (
          <TripCard
            key={trip.name}
            type={trip.tipo}
            rating={trip.valoracion}
            name={trip.name}
            avatar={trip.avatar}
            origin={trip.origin}
            destination={trip.destination}
            date={trip.date}
            price={trip.price}
          />
        ))}
      </div>
    </div>
  );
}
