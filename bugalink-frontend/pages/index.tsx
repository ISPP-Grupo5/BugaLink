import Avatar from '@/components/avatar';
import BookmarkTripList from '@/components/bookmarks/list';
import OptionButton from '@/components/buttons/Option';
import SquareChatsButton from '@/components/buttons/Square/Chats';
import SquareRequestsButton from '@/components/buttons/Square/Requests';
import SquareRoutinesButton from '@/components/buttons/Square/Routines';
import UpcomingTripsCarousel from '@/components/carousel';
import RecommendationsDrawer from '@/components/drawers/Recommendations';
import AnimatedLayout from '@/components/layouts/animated';
import AvatarSkeleton from '@/components/skeletons/Avatar';
import NEXT_ROUTES from '@/constants/nextRoutes';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Destino from 'public/icons/Vista-Principal/destino.svg';
import { useState } from 'react';
import MagnifyingGlass from '/public/icons/Vista-Principal/glass.svg';

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data } = useSession();
  const user = data?.user as User;

  return (
    <AnimatedLayout className="max-h-full overflow-y-scroll">
      <div className="flex flex-col pb-24">
        <span className="my-8 flex items-center space-x-4 px-4 md:px-5">
          <form className="flex w-full items-center rounded-full bg-white px-4 py-3">
            <Destino className="h-5 w-5 flex-none translate-y-0.5 scale-125 fill-light-turquoise stroke-light-turquoise" />
            <input
              type="search"
              placeholder="Dónde quieres ir?"
              className="ml-2 h-full w-full rounded-full pl-2 outline-none"
            />
            <Link href={NEXT_ROUTES.SEARCH_RESULTS}>
              <button data-cy="search-btn" type="submit" className="flex">
                <MagnifyingGlass className="fill-turquoise" />
              </button>
            </Link>
          </form>
          <Link
            data-cy="profile-link"
            className="aspect-square h-14"
            href={NEXT_ROUTES.PROFILE(user?.user_id)}
          >
            {user ? <Avatar src={user.photo} /> : <AvatarSkeleton />}
          </Link>
        </span>

        {user?.is_validated_driver && (
          <OptionButton
            text="Crear viaje"
            className="mx-auto mb-6 h-1/6 w-full px-4"
            Option1="Como pasajero"
            Option2={'Como conductor'}
            isLink={true}
            linkOption1={NEXT_ROUTES.NEW_ROUTINE_PASSENGER}
            linkOption2={NEXT_ROUTES.NEW_ROUTINE_DRIVER}
          />
        )}

        <span className="flex w-full justify-between space-x-5 px-4 md:px-5">
          <SquareRoutinesButton />
          <SquareChatsButton />
          <SquareRequestsButton disabled={!user?.is_validated_driver} />
        </span>

        <span className="mt-4 mb-2 flex justify-between px-4 md:px-5">
          <p className="text-left text-xl font-semibold">Mis próximos viajes</p>
          <Link data-cy="history-link" href={NEXT_ROUTES.TRIP_HISTORY}>
            <p className="text-right text-3xl font-bold text-turquoise">
              Historial
            </p>
          </Link>
        </span>
        <UpcomingTripsCarousel />

        <span className="mt-6 flex flex-col px-4 md:px-5">
          <p className="mb-2 text-left text-xl font-semibold">
            Mis viajes guardados
          </p>
          <BookmarkTripList />
        </span>
      </div>
      <RecommendationsDrawer open={drawerOpen} setOpen={setDrawerOpen} />
    </AnimatedLayout>
  );
}
