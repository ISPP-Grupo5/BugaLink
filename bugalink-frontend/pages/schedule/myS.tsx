import { BackButton } from '../../components/buttons/Back';
import Schedule from '../../components/schedule';

const trips = [
  {
    day: 'Lunes',
    name: 'María Teresa Romero',
    avatar: '../../public/assets/avatar.svg',
    date: '8:00-10:00',
    dots: '../../public/assets/dots.svg',
  },
  {
    day: 'Lunes',
    name: 'Francisco Javier Vázquez',
    avatar: '../../public/assets/avatar.svg',
    date: '12:05-13:20',
    dots: '../../public/assets/dots.svg',
  },
  {
    day: 'Martes',
    name: 'Jesús Marchena',
    avatar: '../../public/assets/avatar.svg',
    date: 'Todos los Lunes, 21:00',
    dots: '../../public/assets/dots.svg',
  },
];

export default function MySchedule() {
  return (
    <>
      <div className="ml-4">
        <p className="font-lato font-semibold text-3xl">Mi horario</p>
      </div>
      <div className="">
        <BackButton />
      </div>
      <div className="trip-list grid justify-items-center">
        {trips.map((trip) => (
          <Schedule
            day={trip.day}
            name={trip.name}
            avatar={trip.avatar}
            date={trip.date}
            dots={trip.dots}
          />
        ))}
      </div>
    </>
  );
}
