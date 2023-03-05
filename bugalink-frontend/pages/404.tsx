import Link from 'next/link';
import Image from 'next/image';
import clowns from '/public/assets/clowns.png';

export default function FourOhFour() {
  return (
    <div className="h-screen lg:px-48 md:px-12 px-6 flex flex-col lg:flex-row justify-evenly items-center bg-secondary">
      <span className="w-1/2">
        <h1 className="text-7xl md:text-9xl font-bold font-montserrat text-teal-900">
          404
        </h1>
        <p className="text-2xl md:text-2xl font-pt-serif md:w-2/3">
          ¡Esta ruta no existe! Pero en BugaLink encontrarás muchas otras rutas
          para llegar a tu destino.{' '}
          <Link className="font-semibold text-teal-800" href="/">
            Vuelve a la carretera
          </Link>
        </p>
      </span>
      <span className="flex justify-center md:w-3/5 xl:w-2/5">
        <Image
          className="w-4/5"
          src={clowns}
          alt="404"
          width={1024}
          height={792}
        />
      </span>
    </div>
  );
}
