import Recommendation from '../components/Layout/recommendation';

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

export default function TripList() {
  return (
    <>
      <div className="ml-3.5">
        <p className="font-lato font-semibold text-3xl">Recomendaciones</p>
        <p className="font-lato font-thin text-base text-gray mb-5 leading-3">
          En base a tu horario sin cubrir
        </p>
      </div>
      <div className="trip-list grid justify-items-center">
        {trips.map((trip) => (
          <Recommendation
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
    </>
  );
}
