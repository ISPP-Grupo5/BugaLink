import SquareChatsButton from '@/components/buttons/Square/Chats';
import SquareRequestsButton from '@/components/buttons/Square/Requests';
import SquareRoutinesButton from '@/components/buttons/Square/Routines';
import UpcomingTripsCarousel from '@/components/carousel';
import RecommendationsDrawer from '@/components/drawers/Recommendations';
import AnimatedLayout from '@/components/layouts/animated';
import NEXT_ROUTES from '@/constants/nextRoutes';
import useUser from '@/hooks/useUser';
import Link from 'next/link';
import Destino from 'public/icons/Vista-Principal/destino.svg';
import { useState } from 'react';
import Glass from '/public/icons/Vista-Principal/glass.svg';

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  // userId has to be hardcoded until we have sessions in the app. This info would be stored in the user's browser
  const USER_ID = 1;
  const { user } = useUser(USER_ID);

  return (
    <AnimatedLayout className="max-h-full overflow-y-scroll">
      <div className="flex flex-col pb-24">
        <span className="my-10 flex items-center space-x-4 px-4 md:px-5">
          <form className="flex w-full items-center rounded-full bg-white px-4 py-3">
            <Destino className="h-5 w-5 flex-none translate-y-0.5 scale-125 fill-light-turquoise stroke-light-turquoise" />
            <input
              type="search"
              placeholder="Dónde quieres ir?"
              className="ml-2 h-full w-full rounded-full pl-2 outline-none"
            ></input>
            <Link href={NEXT_ROUTES.SEARCH_RESULTS}>
              <button type="submit">
                <Glass />
              </button>
            </Link>
          </form>
          <Link
            className="aspect-square h-14"
            href={NEXT_ROUTES.PROFILE(USER_ID)}
          >
            <img className="rounded-full" src={user?.photo} />
          </Link>
        </span>

        <span className="flex w-full justify-between space-x-5 px-4 md:px-5">
          <SquareRoutinesButton />
          <SquareChatsButton />
          <SquareRequestsButton />
        </span>

        <span className="mt-4 mb-2 flex justify-between px-4 md:px-5">
          <p className="text-left text-xl font-semibold">Próximos viajes</p>
          <Link href={NEXT_ROUTES.RIDE_HISTORY(USER_ID)}>
            <p className="text-right text-xl text-turquoise">Historial</p>
          </Link>
        </span>
        <UpcomingTripsCarousel />
        <span className="mt-4 flex flex-col px-4 md:px-5">
          <p className="mb-2 text-left text-xl font-semibold">
            Viajes guardados
          </p>
          <div className="w-full rounded-md border border-border-color py-3 text-center text-lg font-light text-gray">
            ¿Has encontrado un viaje que te interesa?
            <br />
            ¡Guárdalo y aparecerá aquí!
          </div>
        </span>
      </div>
      <RecommendationsDrawer open={drawerOpen} setOpen={setDrawerOpen} />
    </AnimatedLayout>
  );
}
