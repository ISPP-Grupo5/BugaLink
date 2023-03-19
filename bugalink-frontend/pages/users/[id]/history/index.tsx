import TripCard from '@/components/cards/recommendation';
import AnimatedLayout from '@/components/layouts/animated';
import Glass from '/public/icons/Vista-Principal/glass.svg';
import { BackButtonText } from '@/components/buttons/Back';

export default function History() {
  // TODO: Get history from API
  // Create a hook "useTripHistory" following the same pattern as others like "useTripRecommendations"
  return (
    <AnimatedLayout className=" flex flex-col overflow-y-scroll bg-white">
      <div className="sticky top-0 z-10 bg-white px-4 py-5">
        <BackButtonText text={'Historial'} />
        <form className="mt-3 flex w-full items-center rounded-full border border-gray bg-white py-3 px-4">
          <input
            type="search"
            placeholder="Nombre, Origen, Destino..."
            className="w-full text-lg"
          ></input>
          <button type="submit" className="">
            <Glass />
          </button>
        </form>
      </div>

      <div className="divide-y-2 divide-light-gray ">
        <TripCard
          type={'driver'}
          avatar={'/assets/avatar.svg'}
          rating={4.9}
          gender={'F'}
          origin={'Nervion Plaza'}
          destination={'Los Bermejales'}
          price={2.5}
          name={'María Teresa Romero'}
          date={'Lunes 13 de Febrero, 8:45'}
          className="bg-white"
        />
        <TripCard
          type={'passenger'}
          avatar={'/assets/avatar.png'}
          rating={4.7}
          gender={'M'}
          origin={'Prado de San Sebastián'}
          destination={'Dos Hermanas'}
          price={4.5}
          name={'José Perez Rodríguez'}
          date={'Domingo 12 de Febrero, 14:30'}
          className="bg-white"
        />
        <TripCard
          type={'driver'}
          avatar={'/assets/avatar.png'}
          rating={4.6}
          gender={'M'}
          origin={'Plaza de los Ángeles'}
          destination={'El porvenir'}
          price={7.5}
          name={'Paco Sánchez'}
          date={'Viernes 10 de Febrero, 8:45'}
          className="bg-white"
        />
        <TripCard
          type={'passenger'}
          avatar={'/assets/avatar.svg'}
          rating={4.9}
          gender={'F'}
          origin={'El porvenir'}
          destination={'Nervion Plaza'}
          price={1.5}
          name={'Josefina Mayo'}
          date={'Jueves 9 de Febrero, 15:59'}
          className="bg-white"
        />
        <TripCard
          type={'driver'}
          avatar={'/assets/avatar.svg'}
          rating={4.2}
          gender={'F'}
          origin={'Triana'}
          destination={'Plaza de Armas'}
          price={2.5}
          name={'Laurencia Abril'}
          date={'Miércoles 8 de Febrero, 17:00'}
          className="bg-white"
        />
        <TripCard
          type={'passenger'}
          avatar={'/assets/avatar.png'}
          rating={4.6}
          gender={'M'}
          origin={'El Porvenir'}
          destination={'El Prado de San Sebastián'}
          price={1.5}
          name={'Juanmi Martínez'}
          date={'Lunes 6 de Febrero, 15:00'}
          className="bg-white"
        />
      </div>
    </AnimatedLayout>
  );
}
