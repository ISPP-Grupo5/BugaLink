import Link from 'next/link';
import { BackButtonText } from '../../../components/buttons/Back';
import Chat from '/public/assets/chat.svg';
import SourcePin from '/public/assets/source-pin.svg';
import TargetPin from '/public/assets/map-mark.svg';
import Dots from '/public/assets/dots.svg';

export default function DetailsOne() {
  return (
    <div className="flex flex-col h-full">
      <BackButtonText text="Detalles del viaje" />
      {/* Map preview */}
      <Link href="/ride/V1StGXR8_Z5jdHi6B-myT/map">
        <div className="flex flex-row items-center justify-between px-5 py-2">
          <img
            src="/assets/mocks/map.png"
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      </Link>
      {/* Details */}
      <div className="px-5 py-2">
        <p className="text-xs font-lato">Viernes 16 de febrero de 2023</p>
      </div>
      <div className="grid justify-items-center items-center grid-cols-6 grid-rows-3 px-5 py-2">
        <span className="font-lato font-bold text-xs">21:00</span>
        <SourcePin />
        <span className="col-span-4 font-lato text-xs">
          Escuela Técnica Superior de Ingeniería Informática (ETSII), 41002
          Sevilla
        </span>

        <div></div>
        <Dots />
        <hr className="col-span-4 mt-1 mb-1 w-52 text-border-color" />

        <span className="font-lato font-bold text-xs">21:15</span>
        <TargetPin />
        <span className="col-span-4 font-lato text-xs">
          Avenida de Andalucía, 35, Dos Hermanas, 41002 Sevilla
        </span>
      </div>

      <div className="grid justify-items-center">
        <hr className="mt-4 mb-3 w-80 text-border-color" />
      </div>

      {/* Seats selector */}
      <div className="grid grid-rows-2 justify-items-center items-center mb-3">
        <span className="font-lato font-semibold text-sm ml-4">
          ¿Cuántas plazas quieres reservar?
        </span>
        <div className="grid grid-cols-6 bg-base rounded-md h-11 w-4/5 justify-items-center items-center">
          <div className="grid justify-items-center content-center rounded-md bg-white w-8 h-8">
            <span className="font-lato font-bold text-2xl">-</span>
          </div>
          <div className="col-span-4">
            <span className="font-lato font-bold text-2xl">2</span>
          </div>
          <div className="grid justify-items-center content-center rounded-md bg-white w-8 h-8">
            <span className="font-lato font-bold text-2xl">+</span>
          </div>
        </div>
      </div>
      <div className="grid justify-items-center">
        <hr className="mt-4 mb-4 w-80 text-border-color" />
      </div>

      {/* Profile header */}
      <div className="flex flex-row items-center justify-between px-5 py-2">
        <div className="flex flex-row items-center">
          <img
            src="/assets/mocks/profile1.png"
            className="w-11 h-11 rounded-full"
          />
          <div className="flex flex-col ml-3">
            <p className="text-lg font-bold">Jesús Marchena</p>
            <p className="text-xs font-normal">
              {' '}
              <img src="/assets/star.svg" className="w-3 h-3 mb-1 inline" /> 4.8
              - 14 valoraciones
            </p>
          </div>
          <div className="flex flex-col ml-5">
            <button className="rounded-full w-7 h-7 flex items-center justify-center border border-turquoise">
              <Chat className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-col ml-3">
            <button className="rounded-full w-20 h-7 flex items-center justify-center border border-turquoise">
              <p className="text-xs font-bold text-turquoise">Ver perfil</p>
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-row ml-5">
        <p className="font-lato text-dark-turquoise font-bold">
          Añade una nota al conductor
        </p>
      </div>

      {/* Trip request */}
      <div className="w-full mt-3 mb-2 left-0 bg-white rounded-t-lg">
        <div className="grid justify-items-center">
          <hr className="mt-4 mb-4 w-80 text-border-color" />
        </div>
        <div className="grid grid-cols-3 items-center justify-items-center">
          <div className="flex flex-col">
            <p className="text-xs font-normal">Precio total</p>
            <p className="text-xl font-bold">4,00€</p>
          </div>
          <button className="grid col-span-2 rounded-full w-11/12 h-12 items-center justify-center bg-turquoise">
            <p className="text-xl font-bold text-white">PAGAR</p>
          </button>
        </div>
      </div>
    </div>
  );
}
