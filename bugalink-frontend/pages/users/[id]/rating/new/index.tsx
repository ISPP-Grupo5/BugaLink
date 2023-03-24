import { BackButtonText } from "@/components/buttons/Back";
import CTAButton from "@/components/buttons/CTA";
import RatingButton from "@/components/buttons/Ratings";
import AnimatedLayout from "@/components/layouts/animated";
import StarRating from "@/components/starRating";
import axios from "@/lib/axios"
import Link from "next/link";
import { useState } from "react";

export default function RatingScreen() {
  const [rating, setRating] = useState(3);
  const [goodConduction, setGoodConduction] = useState(false);
  const [friendlyDriver, setFriendlyDriver] = useState(true);
  const [knewEachOther, setKnewEachOther] = useState(false);
  const [selectedButtonsText, setSelectedButtonsText] = useState('');

  //Add the values of the 3 RatingButtons to selectedButtonText depending if they are selected or not
  
  const handleButton1Click = () => {
    setSelectedButtonsText(selectedButtonsText ? `${selectedButtonsText}, Buena conducción` : 'Buena conducción');

  };

  const handleButton2Click = () => {
    setSelectedButtonsText(selectedButtonsText ? `${selectedButtonsText}, Conductor agradable` : 'Conductor agradable');

  };

  const handleButton3Click = () => {
    setSelectedButtonsText(selectedButtonsText ? `${selectedButtonsText}, Ya nos conocíamos` : 'Ya nos conocíamos');

  };

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
    console.log("Knew each other: ", selectedButtonsText);

      // transform to asnyc await
      const response = await axios.post('/users/' + driverId + '/reviews/', data);
      console.log(response.data);
  };
  
    return (
        <AnimatedLayout className="flex flex-col justify-around items-center bg-white px-6 sm:px-14">
            <BackButtonText text="¿Cómo ha ido el viaje?" />
            <div className="flex flex-col items-center space-y-4">
                <img
                    src="/assets/mocks/avatar1.png"
                    className="rounded-full "

                />
                <p className="font-bold text-xl">Pablo D. López</p>
            </div>
            <div className="flex flex-col items-center space-y-3">
            <StarRating value={rating} setValue={setRating}/>
            <p className="text-sm text-center">No te preocupes, las valoraciones son anónimas</p>
            </div>

            <div className="flex justify-between space-x-4">
              <RatingButton text="Buena conducción" icon="🛞" selected={goodConduction} setSelected={setGoodConduction}/>
              <RatingButton text="Conductor agradable" icon="🙂" selected={friendlyDriver} setSelected={setFriendlyDriver}/>
              <RatingButton text="Ya nos conocíamos" icon="👋" selected={knewEachOther} setSelected={setKnewEachOther}/>
            </div>
            <div className="space-y-3 text-center">
            <Link href="#" className='text-red'>¿Has tenido algún problema? <b className="text-red-dark">Háznoslo saber</b></Link>
            <CTAButton onClick={handleSubmit} className="mt-6 w-full" text="ENVIAR" />
            </div>
        </AnimatedLayout>

    );
}
