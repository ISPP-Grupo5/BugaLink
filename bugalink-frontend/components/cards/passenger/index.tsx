import Link from 'next/link';
import Destino from 'public/icons/Vista-Principal/destino.svg';
import Origen from 'public/icons/Vista-Principal/origen.svg';

export default function PassengerCard() {
  return (
    <Link
      href="#"
      className="scale-90 -translate-x-2 snap-center shrink-0 block shadow bg-turquoise rounded-2xl hover:bg-gray-100 w-96"
    >
      <span className="bg-white relative rounded-2xl shadow-lg">
        <div className="absolute right-0 z-10 text-right text-ellipsis">
          <p className="relative text-sm inline-block align-top bg-turquoise text-white rounded-bl-xl rounded-tr-xl px-2 py-1">
            {' '}
            COMO PASAJERO
          </p>
        </div>

        <span className="bg-white flex place-items-center pt-2 rounded-2xl overflow-hidden">
          <div className="text-right text-ellipsis">
            <img
              src="/icons/Vista-Principal/hombre.png"
              className="object-scale-down h-20 w-20 scale-75"
            />
          </div>

          <div className="text-left text-ellipsis">
            <p className="text-sm text-black font-bold">1234ABC</p>
            <p className="text-sm text-gray">Tesla Model S</p>
            <p className="text-xs text-gray"> María Teresa Romero</p>
          </div>

          <img
            src="/icons/Vista-Principal/car.svg"
            className="absolute scale-100 right-0 bottom-0"
          />
        </span>
      </span>

      <span className="grid grid-cols-2 rounded-b-2xl px-2 py-1 pl-3.5 pt-3">
        <div className="text-left text-ellipsis text-white text-xs mr-5">
          <p className="text-light-gray">Origen</p>

          <span className="flex flex-row space-x-2 items-center mt-1.5">
            <Origen className="w-3 h-3 fill-white stroke-white scale-125" />
            <p className="text-xs">Calle Nuestra Señor...</p>
          </span>
        </div>

        <div className="text-left text-ellipsis text-white text-xs">
          <p className="text-light-gray">Destino</p>

          <span className="flex flex-row space-x-1.5 items-center mt-1.5">
            <Destino className="w-4 h-4 stroke-light-turquoise fill-light-turquoise scale-125" />
            <p className="text-xs">Avda. Reina Mercedes, 35</p>
          </span>
        </div>

        <div className="text-left text-ellipsis text-white text-xs bt-3">
          <p className="text-light-gray pt-2">Fecha</p>
          <p className="pt-0.5 whitespace-pre">
            📅 Miércoles 14 de febrero, 16:45
          </p>
        </div>

        <div className="text-right text-ellipsis text-white text-lg pt-3">
          <p className="pt-2">2,00€</p>
        </div>
      </span>
    </Link>
  );
}
