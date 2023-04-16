import { BackButtonText } from '@/components/buttons/Back';
import CTAButton from '@/components/buttons/CTA';
import RatingButton from '@/components/buttons/Ratings';
import AnimatedLayout from '@/components/layouts/animated';
import StarRating from '@/components/starRating';
import useTrip from '@/hooks/useTrip';
import useUserStats from '@/hooks/useUserStats';
import axios from '@/lib/axios';
import { Drawer } from '@mui/material';
import { GetServerSideProps } from 'next';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import ReportProblem from '../new/problem';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  const data = {
    id: id,
  };

  return {
    props: { data },
  };
};

export default function RatingScreen({ data }) {
  const authUser = useSession().data?.user as User;

  const tripId = data.id;



  const { trip, isLoading, isError } = useTrip(tripId);

  const driver= trip? trip.driver : null;
  const user = trip? driver.user: null;
  const username =trip? user.first_name +" "+ user.last_name: null;
  const photo = trip? user.photo: null;



  const [ratingValue, setRating] = useState(3);
  const [goodConduction, setGoodConduction] = useState(false);
  const [friendlyDriver, setFriendlyDriver] = useState(true);
  const [knewEachOther, setKnewEachOther] = useState(false);
  const [drawerReport, setDrawerReport] = useState(false);
  const handleSubmit = async () => {
    const datos = {
      user_id: authUser.user_id,
      rating: ratingValue,
      is_good_driver: friendlyDriver,
      is_pleasant_driver: goodConduction,
      already_known: knewEachOther,
    };

    // transform to asnyc await
    const response = await axios.post('trips/' + tripId + '/rate/', datos);
    console.log(response.data);

    //Set values to default just in case so there is no problem in future ratings (see if can bedeleted)

    setGoodConduction(false);
    setFriendlyDriver(true);
    setKnewEachOther(false);
  };

  return (
    <AnimatedLayout className="flex flex-col items-center justify-around bg-white px-6 sm:px-14">
      <BackButtonText text="¿Cómo ha ido el viaje?" />
      <div className="flex flex-col items-center space-y-4">
        <img src={photo? photo: "/assets/mocks/avatar1.png"} className="rounded-full " />
        <p className="text-xl font-bold">{username}</p>
      </div>
      <div className="flex flex-col items-center space-y-3">
        <StarRating value={ratingValue} setValue={setRating} />
        <p className="text-center text-sm">
          No te preocupes, las valoraciones son anónimas
        </p>
      </div>

      <div className="justify-between flex space-x-4">
        <RatingButton
          text="Buena conducción"
          icon="🛞"
          selected={goodConduction}
          setSelected={setGoodConduction}
        />
        <RatingButton
          text="Conductor agradable"
          icon="🙂"
          selected={friendlyDriver}
          setSelected={setFriendlyDriver}
        />
        <RatingButton
          text="Ya nos conocíamos"
          icon="👋"
          selected={knewEachOther}
          setSelected={setKnewEachOther}
        />
      </div>
      <div className="space-y-3 text-center">
        <a onClick={() => setDrawerReport(true)} className="text-red">
          ¿Has tenido algún problema?{' '}
          <b className="text-red-dark">Háznoslo saber</b>
        </a>
        <CTAButton
          onClick={handleSubmit}
          className="mt-6 w-full"
          text="ENVIAR"
        />
        <Drawer
          anchor="bottom"
          open={drawerReport}
          onClose={() => setDrawerReport(false)}
          SlideProps={{
            style: {
              minWidth: '320px',
              maxWidth: '480px',
              width: '100%',
              margin: '0 auto',
              backgroundColor: 'transparent',
            },
          }}
        >
          <ReportProblem />
        </Drawer>
      </div>
    </AnimatedLayout>
  );
}
