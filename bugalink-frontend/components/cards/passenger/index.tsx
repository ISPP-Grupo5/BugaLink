import Link from 'next/link';
import Destino from 'public/icons/Vista-Principal/destino.svg';
import Origen from 'public/icons/Vista-Principal/origen.svg';

type Params = {
  link: string;
};

export default function PassengerCard({ link }: Params) {
  return (
    <Link
      href={link}
      className="hover:bg-gray-100 block w-96 shrink-0 scale-90 snap-center rounded-2xl bg-turquoise shadow"
    >
      <span className="relative rounded-2xl bg-white shadow-lg">
        <div className="absolute right-0 z-10 text-ellipsis text-right">
          <p className="relative inline-block rounded-bl-xl rounded-tr-xl bg-turquoise px-2 py-1 align-top text-sm text-white">
            {' '}
            COMO PASAJERO
          </p>
        </div>

        <span className="flex place-items-center overflow-hidden rounded-2xl bg-white pt-2">
          <div className="text-ellipsis text-right">
            <img
              src="/icons/Vista-Principal/hombre.png"
              className="h-20 w-20 scale-75 object-scale-down"
            />
          </div>

          <div className="text-ellipsis text-left">
            <p className="text-sm font-bold text-black">1234ABC</p>
            <p className="text-sm text-gray">Tesla Model S</p>
            <p className="text-xs text-gray"> María Teresa Romero</p>
          </div>

          <img
            src="/icons/Vista-Principal/car.svg"
            className="absolute right-0 bottom-0 scale-100"
          />
        </span>
      </span>

      <span className="grid grid-cols-2 rounded-b-2xl px-2 py-1 pl-3.5 pt-3">
        <div className="mr-5 text-ellipsis text-left text-xs text-white">
          <p className="text-light-gray">Origen</p>

          <span className="mt-1.5 flex flex-row items-center space-x-2">
            <Origen className="h-3 w-3 scale-125 fill-white stroke-white" />
            <p className="text-xs">Calle Nuestra Señor...</p>
          </span>
        </div>

        <div className="text-ellipsis text-left text-xs text-white">
          <p className="text-light-gray">Destino</p>

          <span className="mt-1.5 flex flex-row items-center space-x-1.5">
            <Destino className="h-4 w-4 scale-125 fill-light-turquoise stroke-light-turquoise" />
            <p className="text-xs">Avda. Reina Mercedes, 35</p>
          </span>
        </div>

        <div className="bt-3 text-ellipsis text-left text-xs text-white">
          <p className="pt-2 text-light-gray">Fecha</p>
          <p className="whitespace-pre pt-0.5">
            📅 Miércoles 14 de febrero, 16:45
          </p>
        </div>

        <div className="text-ellipsis pt-3 text-right text-lg text-white">
          <p className="pt-2">2,00€</p>
        </div>
      </span>
    </Link>
  );
}
