import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col">
        <Link href="/ride/V1StGXR8_Z5jdHi6B-myT/map">
          Detalles viaje (Mapa)
        </Link>
        <Link href="/users/qyahXxJc/routines/passenger/new">
          Crear rutina (pasajero)
        </Link>
        <Link href="/users/qyahXxJc/routines/driver/new">
          Crear rutina (conductor)
        </Link>
      </div>
    </Layout>
  );
}
