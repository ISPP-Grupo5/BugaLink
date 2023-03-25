import { BackButtonText } from "@/components/buttons/Back";
import CTAButton from "@/components/buttons/CTA";
import RatingButton from "@/components/buttons/Ratings";
import AnimatedLayout from "@/components/layouts/animated";
import StarRating from "@/components/starRating";
import axios from "@/lib/axios"
import Link from "next/link";
import { useState } from "react";
import ReportProblem from '../new/problem';
import { Drawer } from '@mui/material';

export default function RatingScreen() {
  const [rating, setRating] = useState(3);
  const [goodConduction, setGoodConduction] = useState(false);
  const [friendlyDriver, setFriendlyDriver] = useState(true);
  const [knewEachOther, setKnewEachOther] = useState(false);
  const [selectedButtonsText, setSelectedButtonsText] = useState('');
  const [drawerReport, setDrawerReport] = useState(false);

  //Add the values of the 3 RatingButtons to selectedButtonText depending if they are selected or not
  


  const driverId = 1; //TODO: change this to the id of the driver
  const passengerId = 2; //TODO: change this to the passenger's id
  const individualRideId = 1; //TODO: change this to the individual ride id
  const userId = 2; //TODO: change this to the user id

  const data = {
    "rating_type": "driver",
    "driver": driverId,
    "passenger": passengerId,
    "IndividualRide": individualRideId,
    "user_id": userId,
    "rating": rating,
    "comment": selectedButtonsText
  };

  const handleSubmit = async () => {
    console.log("Rating: ", rating);
    console.log("Good conduction: ", goodConduction);
    console.log("Friendly driver: ", friendlyDriver);
    console.log("Knew each other: ", knewEachOther);

      // transform to asnyc await
      const response = await axios.post('/users' + driverId + '/reviews/', data);
      console.log(response.data);
  };
  
    return (
      <AnimatedLayout className="flex flex-col items-center justify-around bg-white px-6 sm:px-14">
        <BackButtonText text="¿Cómo ha ido el viaje?" />
        <div className="flex flex-col items-center space-y-4">
          <img src="/assets/mocks/avatar1.png" className="rounded-full " />
          <p className="text-xl font-bold">Pablo D. López</p>
        </div>
        <div className="flex flex-col items-center space-y-3">
          <StarRating value={rating} setValue={setRating} />
          <p className="text-center text-sm">
            No te preocupes, las valoraciones son anónimas
          </p>
        </div>

        <div className="flex justify-between space-x-4">
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
