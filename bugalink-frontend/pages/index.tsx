import Link from 'next/link';
import Layout from '../components/Layout';
import Card from '../components/cards/Passanger';
import DriverCard from '../components/cards/Driver';

export default function Home() {
  return (
    <Layout>
      <div className='flex flex-col h-full'>
        
        <div className="flex flex-col">
          <span className='grid grid-cols-2 mt-5'>

            <div className='text-center text-ellipsis mt-10'>
              <p className='text-5xl inline-block  align-botton'> Hola, Pedro</p>
            </div>
            
            <div className='text-center rounded-full'>
              <img src="/icons/Vista-Principal/hombre.png" className='object-scale-down h-40 w-40 mx-auto scale-90'/> {/*TODO Añadir el icono en concreto*/}
            </div>

          </span>
        </div>

        <div className='flex flex-col'>
          <span className='grid grid-cols-3  text-center items-center pt-3'>
            
              <a href='#' className='bg-base'>
                <img src='/icons/Vista-Principal/calendar.svg' className='object-scale-down h-35 w-35 mx-auto bg-white rounded-xl' />{/*TODO Añadir el icono en concreto*/}
                <p className='text-lg text-center'>Horarios</p>
              </a>

              <a href='#' className='bg-base'>
                <img src='/icons/Vista-Principal/chat.svg' className='object-scale-down h-35 w-35 mx-auto bg-white  rounded-xl pb-0' /> {/*TODO Añadir el icono en concreto*/}
                <p className='text-lg text-center'>Chats</p>
              </a>

              <a href='#' className='bg-base'>
                <img src='/icons/Vista-Principal/house.svg' className='object-scale-down h-35 w-35 mx-auto bg-white rounded-xl' />{/*TODO Añadir el icono en concreto*/}
                <p className='text-lg text-center'>Direcciones</p>
              </a>
              
            
          </span>
        </div>

        <div className='relative' data-carousel="static">
          
          <span className='grid grid-cols-2 mt-5'>
              <p className='text-lg text-left ml-8'>Próximos viajes</p>
              <a href='#'>
                <p className='text-lg text-right mr-8 text-turquoise'>Historial</p>
              </a>
          </span>
          
          <div className="relative w-full flex -space-x-7 snap-x snap-mandatory overflow-x-auto">
                <Card /> 
                <DriverCard /> 
                <Card /> 
                <DriverCard /> 
                <Card />

          </div>

        </div>
            Hello, world!
            <br/>
            <Link href="/ride/V1StGXR8_Z5jdHi6B-myT/map">Detalles viaje (Mapa)</Link>
      </div>
    </Layout>
  );
}
