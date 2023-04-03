import ProfileItems from '@/components/cards/profile';
import NEXT_ROUTES from '@/constants/nextRoutes';
import useUser from '@/hooks/useUser';
import useUserTotalRatings from '@/hooks/useUserTotalRatings';
import useUserTotalRides from '@/hooks/useUserTotalRides';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Avatar from 'public/assets/avatar.svg';
import Check from 'public/assets/check.svg';
import { BackButtonText } from '@/components/buttons/Back';
import AnimatedLayout from '@/components/layouts/animated';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  const data = {
    id: id,
  };

  return {
    props: { data },
  };
};

export default function Profile({ data }) {
  const userId = data.id;
  const { user } = useUser(userId);

  const { userTotalRides } = useUserTotalRides(userId);

  // const dateString = user && user.date_joined ? user.date_joined : '';
  const dateString = '2021-09-01T00:00:00.000Z';
  const year = dateString.substring(0, 4);

  const { userTotalRatings } = useUserTotalRatings(userId);

  return (
    <AnimatedLayout className="flex h-full flex-col overflow-y-scroll">
      <BackButtonText text="Mi perfil" className="bg-base-origin" />
      <div className="flex h-full flex-col -space-y-8">
        <div className="z-10 rounded-t-3xl text-center">
          <div className="relative mx-auto w-min">
            <Avatar className="mx-auto my-2 h-24 w-24 rounded-full outline outline-8 outline-white" />
            <div id="check" className="absolute -bottom-2 -right-2">
              <div className="flex aspect-square w-9 items-center justify-center rounded-full bg-turquoise">
                <Check className="mt-1 scale-90 bg-transparent text-white" />
              </div>
            </div>
          </div>

          <p className="pt-2 text-3xl ">
            {user ? user.first_name : 'Loading...'}
          </p>
          <Link href={NEXT_ROUTES.EDIT_PROFILE(userId)}>
            <p className="text-md text-gray ">Editar perfil</p>
          </Link>
          <div className="py-4 text-light-gray">
            <hr></hr>
          </div>
          <div className="mx-4 mb-6 flex justify-evenly space-x-4 ">
            <div className="w-full -space-y-1 rounded-lg bg-white p-2 shadow-lg">
              <p className="text-xl font-bold">
                {year ? `Desde ${year} ` : 'Loading...'}
              </p>
              <p className="text-sm text-gray">Experiencia</p>
            </div>
            <div className="w-full -space-y-1 rounded-lg bg-white p-2 shadow-lg">
              <p className="text-xl font-bold">
                {userTotalRides ? userTotalRides.total_rides : 'Ninguno'}
              </p>
              <p className="text-sm text-gray">Viajes</p>
            </div>
            <div className="w-full -space-y-1 rounded-lg bg-white p-2 shadow-lg">
              <p className="text-xl font-bold">
                {userTotalRatings ? `${userTotalRatings.rating}⭐` : 'Ninguna'}
              </p>

              <p className="text-sm text-gray">Valoraciones</p>
            </div>
          </div>
        </div>
      </div>
      <ProfileItems />
    </AnimatedLayout>
  );
}
