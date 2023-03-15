import Link from 'next/link';
import Destino from 'public/icons/Vista-Principal/destino.svg';
import Solicitud from 'public/icons/Vista-Principal/solicitud.svg';
import { useEffect, useState } from 'react';
import SquareButton from '../components/buttons/Square';
import DriverCard from '../components/cards/driver';
import PassengerCard from '../components/cards/passenger';
import RecommendationsDrawer from '../components/drawers/Recommendations';
import AnimatedLayout from '../components/layouts/animated';
import NEXT_ROUTES from '../constants/nextRoutes';
import UserI from '../interfaces/user';
import axios from '../utils/axios';
import Calendar from '/public/icons/Vista-Principal/calendar.svg';
import Chat from '/public/icons/Vista-Principal/chat.svg';
import Glass from '/public/icons/Vista-Principal/glass.svg';

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  // userId has to be hardcoded until we have sessions in the app. This info would be stored in the user's browser
  const userId = 1;
  const [user, setUser] = useState<UserI | undefined>(undefined);
  const [pendingChats, setPendingChats] = useState<number>(0);
  const [pendingRequests, setPendingRequests] = useState<number>(0);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await axios.get('/users/' + userId);
      setUser(data);
    };

    const getPendingChats = async () => {
      const { data } = await axios.get(`/users/${userId}/chats/pending/count`);
      setPendingChats(data);
    };

    const getPendingRequests = async () => {
      const { data } = await axios.get(
        `/users/${userId}/requests/pending/count`
      );
      setPendingRequests(data);
    };

    getUser();
    getPendingChats();
    getPendingRequests();
  }, []); // Empty array => only run this code once (when component is first mounted).

  return (
    <AnimatedLayout className="max-h-full overflow-y-scroll">
      <div className="flex flex-col pb-20">
        <span className="my-10 flex items-center space-x-4 px-7">
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
            href={NEXT_ROUTES.PROFILE(userId)}
          >
            <img className="rounded-full" src={user?.photo} />
          </Link>
        </span>

        <span className="flex w-full justify-between px-7">
          <SquareButton
            text="Horarios"
            link={NEXT_ROUTES.MY_ROUTINES(userId)}
            Icon={<Calendar className="rounded-xl bg-white" />}
          />

          <SquareButton
            text="Chats"
            link="#"
            Icon={<Chat className="rounded-xl bg-white " />}
            numNotifications={pendingChats}
          />

          <SquareButton
            text="Solicitudes"
            link={NEXT_ROUTES.PENDING_REQUESTS(userId)}
            Icon={<Solicitud className="rounded-xl bg-white" />}
            numNotifications={pendingRequests}
          />
        </span>

        <span className="mt-5 flex justify-between px-7">
          <p className="text-left text-xl font-semibold">Próximos viajes</p>
          <Link href="/users/qyahXxJc/history">
            <p className="text-right text-xl text-turquoise">Historial</p>
          </Link>
        </span>

        <div data-carousel="static">
          <div className="relative flex w-full snap-x snap-mandatory -space-x-7 overflow-x-auto">
            <PassengerCard link="/ride/V1StGXR8_Z5jdHi6B-myT/detailsOne/?requested=true" />
            <PassengerCard link="/ride/V1StGXR8_Z5jdHi6B-myT/detailsOne/?requested=true" />
            <PassengerCard link="/ride/V1StGXR8_Z5jdHi6B-myT/detailsOne/?requested=true" />
            <PassengerCard link="/ride/V1StGXR8_Z5jdHi6B-myT/detailsOne/?requested=true" />
            <PassengerCard link="/ride/V1StGXR8_Z5jdHi6B-myT/detailsOne/?requested=true" />
            <PassengerCard link="/ride/V1StGXR8_Z5jdHi6B-myT/detailsOne/?requested=true" />
          </div>

          <div className="relative mt-2 flex w-full snap-x snap-mandatory -space-x-7 overflow-x-auto">
            <DriverCard />
            <DriverCard />
            <DriverCard />
            <DriverCard />
            <DriverCard />
            <DriverCard />
          </div>
        </div>
      </div>
      <RecommendationsDrawer open={drawerOpen} setOpen={setDrawerOpen} />
    </AnimatedLayout>
  );
}
