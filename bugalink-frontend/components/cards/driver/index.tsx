import Link from 'next/link';
import Destino from 'public/icons/Vista-Principal/destino.svg';
import Origen from 'public/icons/Vista-Principal/origen.svg';

export default function DriverCard() {
  return (
    <Link
      href="#"
      className="hover:bg-gray-100 block w-96 shrink-0 scale-90 snap-center rounded-2xl bg-green shadow"
    >
      <span className="relative rounded-2xl bg-white shadow-lg">
        <div className="absolute right-0 z-10 text-ellipsis text-right">
          <p className="inline-block rounded-bl-xl rounded-tr-xl bg-green px-2 py-1 align-top text-sm text-white">
            COMO CONDUCTOR
          </p>
        </div>

        <span className="flex overflow-hidden rounded-2xl bg-white pt-2 pb-2">
          <div className="flex scale-90 flex-row -space-x-16">
            <img
              src="/icons/Vista-Principal/hombre.png"
              className="z-20 h-20 w-20 scale-75 object-scale-down"
            />
            <img
              src="/icons/Vista-Principal/hombre.png"
              className="z-10 h-20 w-20 scale-75 object-scale-down"
            />
            <img
              src="/icons/Vista-Principal/hombre.png"
              className="z-0 h-20 w-20 scale-75 object-scale-down"
            />
          </div>

          <div className="overflow-hidden text-ellipsis pt-5 text-left">
            <p className="text-sm text-gray">Pasajeros</p>
            <p className="text-sm font-bold text-black">
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
        <div className="mr-5 text-ellipsis text-left text-xs text-white">
          <p className="text-light-gray">Origen</p>

          <span className="mt-1.5 flex flex-row items-center space-x-2">
            <Origen className="h-3 w-3 scale-125 fill-white stroke-white" />
            <p className="">Plaza de Armas</p>
          </span>
        </div>

        <div className="relative text-ellipsis text-left text-xs text-white">
          <p className="text-light-gray">Destino</p>

          <span className="mt-1.5 flex flex-row items-center space-x-1.5">
            <Destino className="h-4 w-4 scale-125 fill-light-green stroke-light-green" />
            <p className="text-xs">Centro Comercial Lagoh</p>
          </span>
        </div>

        <div className="bt-3 text-ellipsis text-left text-xs text-white">
          <p className="pt-2 text-light-gray">Fecha</p>
          <p className="pt-0.5">📅 Jueves 15 de febrero, 8:00</p>
        </div>

        <div className="text-ellipsis pt-3 text-right text-lg text-white">
          <p className="pt-2">1,00€/pasajero</p>
        </div>
      </span>
    </Link>
  );
}
