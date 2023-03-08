import Link from 'next/link';
import DriverCard from '../components/cards/driver';
import PassengerCard from '../components/cards/passenger';
import Calendar from '/public/icons/Vista-Principal/calendar.svg';
import Chat from '/public/icons/Vista-Principal/chat.svg';
import House from '/public/icons/Vista-Principal/house.svg';

export default function Home() {
  return (
    // TODO: use AnimatedLayout everywhere via _app.tsx
    <div className="h-full w-full bg-baseOrigin">
      <div className="flex flex-col">
        <span className="relative grid grid-cols-2 mt-0.5">
          <div className="text-center text-ellipsis mt-12">
            <p className="text-3xl inline-block align-botton font-semibold">
              {' '}
              Hola, Pedro
            </p>
          </div>

          <div className="absolute text-center rounded-full -right-3 -top-4 scale-75">
            <img
              src="/icons/Vista-Principal/hombre.png"
              className="object-scale-down h-40 w-40 mx-auto scale-50"
            />{' '}
            {/*TODO Añadir el icono en concreto*/}
          </div>
        </span>
      </div>

      <div className="flex py-10">
        <span className="px-2 grid grid-cols-3 justify-items-center w-full">
          <Link href="#" className="bg-baseOrigin">
            <div className="">
              <Calendar className="bg-white rounded-xl " />
            </div>

            <p className="text-lg text-center">Horarios</p>
          </Link>

          <Link href="#" className="bg-baseOrigin">
            <div className="relative content-center">
              <Chat className="bg-white rounded-xl " />
              <p className="absolute bg-lightRed w-7 h-7 rounded-full text-white text-center  -left-2 -top-2">
                3
              </p>
            </div>

            <p className="bg-baseOrigin text-lg text-center">Chats</p>
          </Link>

          <Link href="#" className="bg-baseOrigin">
            <div className="">
              <House className="bg-white rounded-xl " />
            </div>

            <p className="bg-baseOrigin text-lg text-center">Direcciones</p>
          </Link>
        </span>
      </div>

      <div className="relative" data-carousel="static">
        <span className="grid grid-cols-2 -mt-4">
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
      </div>
    </div>
  );
}
