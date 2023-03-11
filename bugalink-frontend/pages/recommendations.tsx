import TripCard from '../components/cards/recommendation';
import AnimatedLayout from '../components/layouts/animated';

const trips = [
  {
    tipo: 'driver',
    valoracion: '4.9',
    name: 'María Teresa Romero',
    gender: 'F',
    avatar: '/assets/avatar.png',
    origin: 'Centro comercial Way',
    destination: 'Centro comercial Lagoh',
    date: 'Todos los Martes, 8:00',
    price: '2,00€',
  },
  {
    tipo: 'driver',
    valoracion: '4.6',
    name: 'Francisco Javier Vázquez',
    gender: 'M',
    avatar: '/assets/avatar.png',
    origin: 'Carrefour Dos Hermanas',
    destination: 'Parking CC. Lagoh',
    date: 'Todos los Martes, 8:05',
    price: '2,00€',
  },
  {
    tipo: 'driver',
    valoracion: '4.8',
    name: 'Jesús Marchena',
    gender: 'M',
    avatar: '/assets/avatar.png',
    origin: 'Escuela Técnica Superior de Ingeniería Informática',
    destination: 'Avda. de Andalucía, 35',
    date: 'Todos los Lunes, 21:00',
    price: '1,50€',
  },
];

export default function TripList() {
  return (
    <AnimatedLayout className="px-4 pt-2 bg-white">
      <p className="font-medium text-3xl">Recomendaciones</p>
      <p className="font-thin text-base text-gray mb-5 leading-3">
        En base a tu horario sin cubrir
      </p>
      <div className="flex flex-col space-y-4">
        {trips.map((trip) => (
          <TripCard
            key={trip.name}
            type={trip.tipo}
            rating={trip.valoracion}
            name={trip.name}
            gender={trip.gender}
            avatar={trip.avatar}
            origin={trip.origin}
            destination={trip.destination}
            date={trip.date}
            price={trip.price}
            className="bg-white rounded-md outline outline-1 outline-light-gray"
          />
        ))}
      </div>
    </AnimatedLayout>
  );
}
