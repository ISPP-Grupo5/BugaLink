import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      Hello, world!
      <br />
      <Link href="/ride/V1StGXR8_Z5jdHi6B-myT/map">Detalles viaje (Mapa)</Link>
    </Layout>
  );
}
