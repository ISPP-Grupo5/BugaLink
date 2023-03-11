import { SwipeableDrawer } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import DriverCard from '../components/cards/driver';
import PassengerCard from '../components/cards/passenger';
import AnimatedLayout from '../components/layouts/animated';
import TripList from './recommendations';
import Calendar from '/public/icons/Vista-Principal/calendar.svg';
import Chat from '/public/icons/Vista-Principal/chat.svg';
import Glass from '/public/icons/Vista-Principal/glass.svg';
import Solicitud from 'public/icons/Vista-Principal/solicitud.svg';
import Destino from 'public/icons/Vista-Principal/destino.svg';
import SquareButton from '../components/buttons/Square';

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <AnimatedLayout className="overflow-y-scroll max-h-full">
      <div className="flex flex-col">
        <span className="flex items-center px-7 my-10 space-x-4">
          <form className="flex py-3 px-4 w-full bg-white rounded-full items-center">
            <Destino className="w-5 h-5 stroke-light-turquoise fill-light-turquoise flex-none scale-125 translate-y-0.5" />
            <input
              type="search"
              placeholder="Dónde quieres ir?"
              className="w-full text-sm rounded-full ml-2"
            ></input>
            <button type="submit" className="">
              <Glass />
            </button>
          </form>
          <img
            src="/icons/Vista-Principal/hombre.png"
            className="h-14 aspect-square rounded-full"
          />
        </span>

        <span className="flex justify-between w-full px-7">
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

        <span className="flex justify-between mt-5 px-7">
          <p className="text-xl text-left font-semibold">Próximos viajes</p>
          <a href="/users/qyahXxJc/history">
            <p className="text-xl text-right text-turquoise font-semibold">
              Historial
            </p>
          </a>
        </span>

        <div data-carousel="static">
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
          <Link href="/request/V1StGXR8_Z5jdHi6B-myT/accept">
            Aceptar petición
          </Link>
        </div>
      </div>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        swipeAreaWidth={80}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
        id="SwipeableDrawer"
        allowSwipeInChildren={true}
        SlideProps={{
          style: {
            minWidth: '320px',
            maxWidth: '480px',
            width: '100%',
            margin: '0 auto',
          },
        }}
      >
        <TripList open={open} setOpen={setOpen} />
      </SwipeableDrawer>
    </AnimatedLayout>
  );
}
