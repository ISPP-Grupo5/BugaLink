import { BackButtonText } from '../../components/buttons/Back';
import DropdownButton from '../../components/buttons/Plus';
import Schedule from '../../components/schedule';
import MyDay from '../../components/schedule/days';

const trips = [
  {
    rol: 'Pasajero',
    avatar: '../../public/assets/avatar.svg',
    date: '8:00-10:00',
    dots: '../../public/assets/dots.svg',
  },
  {
    rol: 'Pasajero',
    avatar: '../../public/assets/avatar.svg',
    date: '12:05-13:20',
    dots: '../../public/assets/dots.svg',
  },
  {
    rol: 'Conductor',
    avatar: '../../public/assets/avatar.svg',
    date: '21:00-22:00',
    dots: '../../public/assets/dots.svg',
  },
];

const trips2 = [
  {
    rol: 'Pasajero',
    avatar: '../../public/assets/avatar.svg',
    date: '10:00-10:35',
    dots: '../../public/assets/dots.svg',
  },
  {
    rol: 'Pasajero',
    avatar: '../../public/assets/avatar.svg',
    date: '23:00-00:00',
    dots: '../../public/assets/dots.svg',
  },
];

const trips3 = [
  {
    rol: 'Pasajero',
    avatar: '../../public/assets/avatar.svg',
    date: '10:00-10:35',
    dots: '../../public/assets/dots.svg',
  },
  {
    rol: 'Conductor',
    avatar: '../../public/assets/avatar.svg',
    date: '16:00-16:45',
    dots: '../../public/assets/dots.svg',
  },
  {
    rol: 'Pasajero',
    avatar: '../../public/assets/avatar.svg',
    date: '23:00-00:00',
    dots: '../../public/assets/dots.svg',
  },
];

export default function MySchedule() {
  return (
    <>
      <div className="flex flex-col mx-4">
        <div>
          <BackButtonText text="Mi horario" />
        </div>
        <div className="pt-20">
          <div className="trip-list divide-y divide-gray">
            <div className="pt-5">
              <MyDay day="Lunes" />
              <div className="trip-list divide-y divide-gray">
                {trips.map((trip) => (
                  <Schedule
                    rol={trip.rol}
                    avatar={trip.avatar}
                    date={trip.date}
                    dots={trip.dots}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="pt-5">
            <MyDay day="Martes" />
            <div className="trip-list divide-y divide-gray">
              {trips2.map((trip) => (
                <Schedule
                  rol={trip.rol}
                  avatar={trip.avatar}
                  date={trip.date}
                  dots={trip.dots}
                />
              ))}
            </div>
          </div>
          <div className="pt-5">
            <MyDay day="Miércoles" />
            <div className="trip-list divide-y divide-gray">
              {trips3.map((trip) => (
                <Schedule
                  rol={trip.rol}
                  avatar={trip.avatar}
                  date={trip.date}
                  dots={trip.dots}
                />
              ))}
            </div>
          </div>
        </div>
        <DropdownButton />
      </div>
    </>
  );
}
