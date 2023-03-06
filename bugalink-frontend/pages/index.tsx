import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col">
        <Link href="/ride/V1StGXR8_Z5jdHi6B-myT/detailsOne">
          Detalles viaje (1)
        </Link>
        <Link href="/ride/V1StGXR8_Z5jdHi6B-myT/map">
          Detalles viaje (Mapa)
        </Link>
        <Link href="/ride/V1StGXR8_Z5jdHi6B-myT/detailsTwo">
          Detalles viaje (2)
        </Link>
        <Link href="/users/qyahXxJc/routines/passenger/new">
          Crear rutina (pasajero)
        </Link>
        <Link href="/users/qyahXxJc/routines/driver/new">
          Crear rutina (conductor)
        </Link>
        <Link href="/recommendations">
          Recomendaciones
        </Link>
      </div>
    </Layout>
  );
}
