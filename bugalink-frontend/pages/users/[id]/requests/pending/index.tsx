import { BackButtonText } from '../../../../../components/buttons/Back';
import RequestCard from '../../../../../components/cards/request';
import AnimatedLayout from '../../../../../components/layouts/animated';

// TODO: Remove this mock data and fetch it from the API
const requests = [
  {
    type: 'passenger',
    passengerType: 'recurring',
    name: 'María Teresa Romero',
    rating: 4.9,
    gender: 'F',
    origin: 'Centro comercial Way',
    destination: 'Centro comercial Lagoh',
    price: 2.0,
    date: 'Cada Lunes, Martes y Viernes, 8:00',
    avatar: '/assets/avatar.png',
    hash: 1,
  },
  {
    type: 'passenger',
    passengerType: 'single',
    name: 'Jesús Marchena',
    rating: 4.2,
    gender: 'M',
    origin:
      'Escuela Técnica Superior de Ingeniería Informática (ETSII), Sevilla',
    destination: 'Avda. de Andalucía, 35',
    price: 2.5,
    date: 'Lunes 26 de febrero, 14:30',
    avatar: '/assets/avatar.png',
    hash: 2,
  },
  {
    type: 'passenger',
    passengerType: 'single',
    name: 'Susana Oria',
    rating: 4.2,
    gender: 'F',
    origin: 'Centro comercial Way',
    destination: 'Avda. de Andalucía, 35',
    price: 1.0,
    date: 'Martes 27 de febrero, 14:30',
    avatar: '/assets/avatar.png',
    hash: 3,
  },
];

export default function PendingRequests() {
  return (
    <AnimatedLayout className="bg-white">
      <BackButtonText text={'Solicitudes pendientes'} />
      <div className="mx-6 space-y-4">
        {requests.map((request) => (
          <RequestCard
            key={request.hash}
            type={request.type}
            passengerType={request.passengerType}
            name={request.name}
            rating={request.rating}
            gender={request.gender}
            origin={request.origin}
            destination={request.destination}
            price={request.price}
            date={request.date}
            avatar={request.avatar}
          />
        ))}
      </div>
    </AnimatedLayout>
  );
}
