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
    <AnimatedLayout className="overflow-y-scroll max-h-full">
      <div className="flex flex-col pb-20">
        <span className="flex items-center px-7 my-10 space-x-4">
          <form className="flex px-4 py-3 w-full bg-white rounded-full items-center">
            <Destino className="w-5 h-5 stroke-light-turquoise fill-light-turquoise flex-none scale-125 translate-y-0.5" />
            <input
              type="search"
              placeholder="Dónde quieres ir?"
              className="w-full h-full rounded-full ml-2 pl-2 outline-none"
            ></input>
            <Link href={NEXT_ROUTES.SEARCH_RESULTS}>
              <button type="submit">
                <Glass />
              </button>
            </Link>
          </form>
          <Link
            className="h-14 aspect-square"
            href={NEXT_ROUTES.PROFILE(userId)}
          >
            <img className="rounded-full" src={user?.photo} />
          </Link>
        </span>

        <span className="flex justify-between w-full px-7">
          <SquareButton
            text="Horarios"
            link={NEXT_ROUTES.MY_ROUTINES(userId)}
            Icon={<Calendar className="bg-white rounded-xl" />}
          />

          <SquareButton
            text="Chats"
            link="#"
            Icon={<Chat className="bg-white rounded-xl " />}
            numNotifications={pendingChats}
          />

          <SquareButton
            text="Solicitudes"
            link={NEXT_ROUTES.PENDING_REQUESTS(userId)}
            Icon={<Solicitud className="bg-white rounded-xl" />}
            numNotifications={pendingRequests}
          />
        </span>

        <span className="flex justify-between mt-5 px-7">
          <p className="text-xl text-left font-semibold">Próximos viajes</p>
          <Link href="/users/qyahXxJc/history">
            <p className="text-xl text-right text-turquoise font-semibold">
              Historial
            </p>
          </Link>
        </span>

        <div data-carousel="static">
          <div className="relative w-full flex -space-x-7 snap-x snap-mandatory overflow-x-auto">
            <PassengerCard link="/ride/V1StGXR8_Z5jdHi6B-myT/detailsOne/?requested=true" />
            <PassengerCard link="/ride/V1StGXR8_Z5jdHi6B-myT/detailsOne/?requested=true" />
            <PassengerCard link="/ride/V1StGXR8_Z5jdHi6B-myT/detailsOne/?requested=true" />
            <PassengerCard link="/ride/V1StGXR8_Z5jdHi6B-myT/detailsOne/?requested=true" />
            <PassengerCard link="/ride/V1StGXR8_Z5jdHi6B-myT/detailsOne/?requested=true" />
            <PassengerCard link="/ride/V1StGXR8_Z5jdHi6B-myT/detailsOne/?requested=true" />
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
      </div>
      <RecommendationsDrawer open={drawerOpen} setOpen={setDrawerOpen} />
    </AnimatedLayout>
  );
}
