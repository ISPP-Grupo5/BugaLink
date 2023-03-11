import Link from 'next/link';
import Destino from 'public/icons/Vista-Principal/destino.svg';
import Origen from 'public/icons/Vista-Principal/origen.svg';

export default function DriverCard() {
  return (
    <Link
      href="#"
      className="scale-90 snap-center shrink-0 block shadow bg-green rounded-2xl hover:bg-gray-100 w-96"
    >
      <span className="bg-white relative rounded-2xl shadow-lg">
        <div className="absolute right-0 z-10 text-right text-ellipsis">
          <p className="text-sm inline-block align-top bg-green text-white rounded-bl-xl rounded-tr-xl px-2 py-1">
            COMO CONDUCTOR
          </p>
        </div>

        <span className="bg-white flex pt-2 pb-2 rounded-2xl overflow-hidden">
          <div className="scale-90 -space-x-16 flex flex-row">
            <img
              src="/icons/Vista-Principal/hombre.png"
              className="object-scale-down h-20 w-20 scale-75 z-20"
            />
            <img
              src="/icons/Vista-Principal/hombre.png"
              className="object-scale-down h-20 w-20 scale-75 z-10"
            />
            <img
              src="/icons/Vista-Principal/hombre.png"
              className="object-scale-down h-20 w-20 scale-75 z-0"
            />
          </div>

          <div className="text-left text-ellipsis overflow-hidden pt-5">
            <p className="text-sm text-gray">Pasajeros</p>
            <p className="text-sm text-black font-bold">
              Juan Blanco y 2 más...
            </p>
          </div>

          <img
            src="/icons/Vista-Principal/passanger.svg"
            className="absolute -right-6 -bottom-8"
          />
        </span>
      </span>

      <span className="grid grid-cols-2 rounded-b-2xl px-2 py-1 pl-3.5 pt-3">
        <div className="text-left text-ellipsis text-white text-xs mr-5">
          <p className="text-light-gray">Origen</p>

          <span className="flex flex-row space-x-2 items-center mt-1.5">
            <Origen className="w-3 h-3 fill-white stroke-white scale-125" />
            <p className="">Plaza de Armas</p>
          </span>
        </div>

        <div className="relative text-left text-ellipsis text-white text-xs">
          <p className="text-light-gray">Destino</p>

          <span className="flex flex-row space-x-1.5 items-center mt-1.5">
            <Destino className="w-4 h-4 stroke-light-green fill-light-green scale-125" />
            <p className="text-xs">Centro Comercial Lagoh</p>
          </span>
        </div>

        <div className="text-left text-ellipsis text-white text-xs bt-3">
          <p className="text-light-gray pt-2">Fecha</p>
          <p className="pt-0.5">📅 Jueves 15 de febrero, 8:00</p>
        </div>

        <div className="text-right text-ellipsis text-white text-lg pt-3">
          <p className="pt-2">1,00€/pasajero</p>
        </div>
      </span>
    </Link>
  );
}
