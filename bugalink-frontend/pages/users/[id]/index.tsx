import AnimatedLayout from '../../../components/layouts/animated';
import { BackButtonText } from '../../../components/buttons/Back';
import Avatar from 'public/assets/avatar.svg';
import ProfileItems from '@/components/cards/profile';
import Check from 'public/assets/check.svg';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useUser from '@/hooks/useUser';
import { GetServerSideProps } from 'next';
import useUserTotalRides from '@/hooks/useUserTotalRides';
import useUserTotalRatings from '@/hooks/useUserTotalRatings';
import Link from 'next/link';
import NEXT_ROUTES from '@/constants/nextRoutes';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  const data = {
    id: id,
  }

  return {
    props: { data },
  };
};


export default function Profile({data}) {
  const user_id = data.id;
  const { user } = useUser(user_id);

  const { userTotalRides } = useUserTotalRides(user_id);

  const dateString = user && user.date_joined ? user.date_joined : 'Loading...';
  const year = dateString.substr(0, 4);

  const { userTotalRatings } = useUserTotalRatings(user_id);


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
          
          <p className="pt-2 text-3xl ">{user ? user.first_name : 'Loading...'}</p>
          <Link href={NEXT_ROUTES.EDIT_PROFILE(user_id)}>
            <p className="text-md text-gray ">Editar perfil</p>
          </Link>
          <div className="py-4 text-light-gray">
            <hr></hr>
          </div>
          <div className="mx-4 mb-6 flex justify-evenly space-x-4 ">
            <div className="w-full -space-y-1 rounded-lg bg-white p-2 shadow-lg">
              <p className="text-xl font-bold">{year ? `Desde ${year} ` : 'Loading...'}</p>
              <p className="text-sm text-gray">Experiencia</p>
            </div>
            <div className="w-full -space-y-1 rounded-lg bg-white p-2 shadow-lg">
              <p className="text-xl font-bold">{userTotalRides ? userTotalRides.total_rides : 'Ninguno'}</p>
              <p className="text-sm text-gray">Viajes</p>
            </div>
            <div className="w-full -space-y-1 rounded-lg bg-white p-2 shadow-lg">
              <p className="text-xl font-bold">{userTotalRatings ? `${userTotalRatings.rating}⭐` : 'Ninguna'}</p>

              <p className="text-sm text-gray">Valoraciones</p>
            </div>
          </div>
        </div>
      </div>
      <ProfileItems />
    </AnimatedLayout>
  );
}
