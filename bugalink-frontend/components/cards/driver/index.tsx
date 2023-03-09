import Link from 'next/link';

export default function DriverCard() {
  return (
    <Link
      href="#"
      className="scale-90 -translate-x-2 snap-center shrink-0 block shadow bg-green rounded-2xl hover:bg-gray-100 w-96"
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
        <div className="relative text-left text-ellipsis text-white text-xs mr-5">
          <p className="text-lightGray">Origen</p>
          <svg
            className="absolute top-6 scale-105  fill-green"
            width="12"
            height="13"
            viewBox="0 0 12 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6.38611C4 5.48494 4.73054 4.75439 5.63171 4.75439C6.53289 4.7544 7.26343 5.48494 7.26343 6.38611C7.26343 7.28728 6.53288 8.01782 5.63171 8.01782C4.73054 8.01782 4 7.28728 4 6.38611Z"
              stroke="white"
              strokeWidth="8"
            />
          </svg>
          <p className="pl-4 pt-2">Plaza de Armas</p>
        </div>

        <div className="relative text-left text-ellipsis text-white text-xs">
          <p className="text-lightGray">Destino</p>
          <svg
            className="absolute top-6 scale-125  fill-green"
            width="12"
            height="13"
            viewBox="0 0 12 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.26343 5.63171C7.26343 6.53288 6.53288 7.26343 5.63171 7.26343C4.73054 7.26343 4 6.53288 4 5.63171C4 4.73054 4.73054 4 5.63171 4C6.53288 4 7.26343 4.73054 7.26343 5.63171Z"
              stroke="#E7FBAF"
              strokeWidth="8"
            />
            <path
              d="M11.2634 6.58571C10.7941 10.0578 6.57033 15.0179 5.63171 15.0179C4.69309 15.0179 0.469309 10.0578 0 6.58568C0 3.29841 2.5214 9.56178 5.63171 9.56178C8.74202 9.56178 11.2634 3.29844 11.2634 6.58571Z"
              fill="#E7FBAF"
            />
            <path
              d="M11.2634 6.58571C10.7941 10.0578 6.57033 15.0179 5.63171 15.0179C4.69309 15.0179 0.469309 10.0578 0 6.58568C0 3.29841 2.5214 9.56178 5.63171 9.56178C8.74202 9.56178 11.2634 3.29844 11.2634 6.58571Z"
              fill="#E7FBAF"
            />
          </svg>
          <p className="pl-4 pt-2 text-xs">Centro Comercial Lagoh</p>
        </div>

        <div className="text-left text-ellipsis text-white text-xs bt-3">
          <p className="text-lightGray pt-2">Fecha</p>
          <p className="pt-0.5">📅 Jueves 15 de febrero, 8:00</p>
        </div>

        <div className="text-right text-ellipsis text-white text-lg pt-3">
          <p className="pt-2">1,00€/pasajero</p>
        </div>
      </span>
    </Link>
  );
}
