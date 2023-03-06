import Link from 'next/link';
import Layout from '../components/Layout';
import Card from '../components/cards/Passanger';
import DriverCard from '../components/cards/Driver';
import Chat from '/public/icons/Vista-Principal/chat.svg';
import House from '/public/icons/Vista-Principal/house.svg';
import Calendar from '/public/icons/Vista-Principal/calendar.svg';

export default function Home() {
  return (
    <Layout>
      <div className='flex flex-col h-full'>
        
        <div className="flex flex-col">
          <span className='relative grid grid-cols-2 mt-0.5'>

            <div className='text-center text-ellipsis mt-12 -ml-10'>
              <p className='text-2xl inline-block align-botton font-semibold'> Hola, Pedro</p>
            </div>
            
            <div className='absolute text-center rounded-full -right-3 -top-4 w-25 h-25 '>
              <img src="/icons/Vista-Principal/hombre.png" className='object-scale-down h-40 w-40 mx-auto scale-50'/> {/*TODO Añadir el icono en concreto*/}
            </div>

          </span>
        </div>

        <div className='flex  py-10'>
          <span className='grid grid-cols-3 justify-items-center w-full'>
            
            <Link href='#' className='bg-base' >
              <div className=''>
                <Calendar className='bg-white rounded-xl '/>
              </div>
              
              <p className='text-lg text-center font-bold'>Horarios</p>
            </Link>

            <Link href='#' className='bg-base'>
              <div className='relative content-center'>
                <Chat className='bg-white rounded-xl '/>
                <p className='absolute bg-lightRed w-7 h-7 rounded-full text-white text-center  -left-2 -top-2'>3</p>
              </div>

              <p className='bg-base text-lg text-center font-bold'>Chats</p>
            </Link>

            <Link href='#'className='bg-base'>
              <div className=''>
                <House className='bg-white rounded-xl '/>
              </div>
              
              <p className='bg-base text-lg text-center font-bold'>Dirrecciones</p>
            </Link>
          </span>
          

        </div>

        <div className='relative' data-carousel="static">
          
          <span className='grid grid-cols-2 -mt-4'>
              <p className='text-xl text-left ml-5 font-bold'>Próximos viajes</p>
              <a href='#'>
                <p className='text-xl text-right mr-8 text-turquoise font-bold'>Historial</p>
              </a>
          </span>
          
          <div className="relative w-full flex -space-x-7 snap-x snap-mandatory overflow-x-auto">
                <Card />  
                <Card /> 
                <Card />
          </div>

          <div className="relative w-full flex -space-x-7 snap-x snap-mandatory overflow-x-auto mt-2"> 
                <DriverCard /> 
                <DriverCard /> 
                <DriverCard /> 

          </div>

        </div>
            Hello, world!
            <br/>
            <Link href="/ride/V1StGXR8_Z5jdHi6B-myT/map">Detalles viaje (Mapa)</Link>
      </div>
    </Layout>
  );
}
