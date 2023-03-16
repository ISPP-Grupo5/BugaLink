import Link from 'next/link';
import Image from 'next/image';
import clowns from '/public/assets/clowns.png';
import AnimatedLayout from '../components/layouts/animated';

export default function FourOhFour() {
  return (
    <AnimatedLayout className="grid grid-rows-2 place-items-center overflow-y-scroll p-4 px-8">
      <span>
        <h1 className="font-montserrat text-8xl font-bold md:text-9xl">404</h1>
        <p className="font-pt-serif text-2xl">
          ¡Esta ruta no existe! Pero en BugaLink encontrarás muchas otras rutas
          para llegar a tu destino.{' '}
          <Link className="font-semibold" href="/">
            Vuelve a la carretera
          </Link>
        </p>
      </span>
      <Image src={clowns} alt="404" width={1024} height={792} />
    </AnimatedLayout>
  );
}
