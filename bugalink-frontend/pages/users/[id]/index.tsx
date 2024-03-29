import Avatar from '@/components/avatar';
import { BackButtonText } from '@/components/buttons/Back';
import ProfileItems from '@/components/cards/profile';
import AnimatedLayout from '@/components/layouts/animated';
import NEXT_ROUTES from '@/constants/nextRoutes';
import useUser from '@/hooks/useUser';
import useUserStats from '@/hooks/useUserStats';
import UserI from '@/interfaces/user';
import { shortenName } from '@/utils/formatters';
import { GetServerSideProps } from 'next';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Check from 'public/assets/check.svg';

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
  const authUser = useSession().data?.user as User;

  const profileUserId = data.id;
  const user = useUser(profileUserId).user as UserI;
  const { userStats } = useUserStats(profileUserId);
  const isMyProfile = authUser?.user_id.toString() === profileUserId;

  if (!user) return <div></div>;
  return (
    <AnimatedLayout className="flex h-full flex-col overflow-y-scroll">
      <BackButtonText
        text={isMyProfile ? 'Mi perfil' : `Perfil de ${user.first_name}`}
        className="bg-base-origin"
      />
      <div className="flex h-full flex-col -space-y-8">
        <div className="z-10 rounded-t-3xl text-center">
          <div className="relative mx-auto h-24 w-24 ">
            <Avatar
              src={user.photo}
              className=" my-2 outline outline-8 outline-white"
            />
            <div id="check" className="absolute -bottom-2 -right-2">
              <div className="flex aspect-square w-9 items-center justify-center rounded-full bg-turquoise">
                <Check className="mt-1 scale-90 bg-transparent text-white" />
              </div>
            </div>
          </div>

          <p className="pt-6 text-3xl">
            {shortenName(user.first_name, user.last_name)}
          </p>
          {isMyProfile && (
            <Link href={NEXT_ROUTES.EDIT_PROFILE(profileUserId)}>
              <p className="text-md text-gray ">Editar perfil</p>
            </Link>
          )}
          <div className="py-4 text-light-gray">
            <hr></hr>
          </div>
          <div className="mx-4 mb-6 flex place-items-end justify-evenly space-x-4 ">
            <div className="w-full -space-y-1 rounded-lg bg-white p-2 shadow-lg">
              <p className="text-xl font-bold">
                {user?.date_joined ? user.date_joined.substring(0, 4) : '—'}
              </p>
              <p className="text-sm text-gray">Antiguedad</p>
            </div>
            <div className="w-full -space-y-1 rounded-lg bg-white p-2 shadow-lg">
              <p className="text-xl font-bold">
                {userStats ? userStats.total_rides : '—'}
              </p>
              <p className="text-sm text-gray">Viajes</p>
            </div>
            <div className="w-full -space-y-1 rounded-lg bg-white p-2 shadow-lg">
              <p className="text-xl font-bold">
                {userStats ? `${userStats.rating.toPrecision(2)} ⭐` : '—'}
              </p>

              <p className="text-sm text-gray">Valoraciones</p>
            </div>
          </div>
        </div>
      </div>
      {isMyProfile && <ProfileItems />}
    </AnimatedLayout>
  );
}
