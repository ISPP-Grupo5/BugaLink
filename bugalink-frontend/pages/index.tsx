import Link from 'next/link';
import DriverCard from '../components/cards/driver';
import PassengerCard from '../components/cards/passenger';
import Calendar from '/public/icons/Vista-Principal/calendar.svg';
import Chat from '/public/icons/Vista-Principal/chat.svg';
import Glass from '/public/icons/Vista-Principal/glass.svg';
import Solicitud from 'public/icons/Vista-Principal/solicitud.svg';
import Destino from 'public/icons/Vista-Principal/destino.svg';
import SquareButton from '../components/buttons/Square';

export default function Home() {
  return (
    // TODO: use AnimatedLayout everywhere via _app.tsx
    <div className="h-full w-full bg-baseOrigin">
      <div className="flex flex-col">
        <span className="relative flex items-center">
          <form className="flex flex-grow h-12 w-full relative bg-white rounded-full justify-items-center ml-3">
            <div className="ml-3 mt-3.5">
              <Destino className="w-5 h-5 stroke-light-turquoise fill-light-turquoise flex-none scale-125" />
            </div>

            <input
              type="search"
              placeholder="Dónde quieres ir?"
              className="w-full text-xs rounded-full ml-1.5"
            ></input>

            <button type="submit" className="mr-4 -mt-1 ">
              <Glass />
            </button>
          </form>

          <div className="rounded-full">
            <img
              src="/icons/Vista-Principal/hombre.png"
              className="object-scale-down h-44 w-44 scale-50"
            />
          </div>
        </span>
      </div>

      <div className="flex">
        <span className="px-2 grid grid-cols-3 justify-items-center w-full">
          <SquareButton
            text="Horarios"
            link="#"
            Icon={<Calendar className="bg-white rounded-xl" />}
          />

          <SquareButton
            text="Chats"
            link="#"
            Icon={<Chat className="bg-white rounded-xl " />}
            numNotifications={3}
          />

          <SquareButton
            text="Solicitudes"
            link="#"
            Icon={<Solicitud className="bg-white rounded-xl" />}
            numNotifications={1}
          />
        </span>
      </div>

      <div className="relative" data-carousel="static">
        <span className="grid grid-cols-2 mt-4">
          <p className="text-xl text-left ml-4 font-semibold">
            Próximos viajes
          </p>
          <a href="#">
            <p className="text-xl text-right mr-4 text-turquoise font-semibold">
              Historial
            </p>
          </a>
        </span>

        <div className="relative w-full flex -space-x-7 snap-x snap-mandatory overflow-x-auto">
          <PassengerCard />
          <PassengerCard />
          <PassengerCard />
          <PassengerCard />
          <PassengerCard />
          <PassengerCard />
        </div>

        <div className="relative w-full flex -space-x-7 snap-x snap-mandatory overflow-x-auto mt-2">
          <DriverCard />
          <DriverCard />
          <DriverCard />
          <DriverCard />
          <DriverCard />
          <DriverCard />
        </div>
      </div>
      <div className="flex flex-col">
        <Link href="/ride/V1StGXR8_Z5jdHi6B-myT/detailsOne">
          Detalles viaje (1)
        </Link>
        <Link href="/ride/V1StGXR8_Z5jdHi6B-myT/map">
          Detalles viaje (Mapa)
        </Link>
        <Link href="/ride/V1StGXR8_Z5jdHi6B-myT/detailsTwo">
          Detalles viaje (2)
        </Link>
        <Link href="/users/qyahXxJc/routines/passenger/new">
          Crear rutina (pasajero)
        </Link>
        <Link href="/users/qyahXxJc/routines/driver/new">
          Crear rutina (conductor)
        </Link>
        <Link href="/recommendations">Recomendaciones</Link>
        <Link href="/request/V1StGXR8_Z5jdHi6B-myT/accept">Aceptar petición</Link>
      </div>
    </div>
  );
}
