import Layout from '../components/Layout';
import People from '../components/People';

export default function AboutPage() {
  return (
    <Layout title="About | BugaLink">
      <section className="pt-24 md:mt-0 lg:px-48 md:px-12 px-4 bg-secondary font-pt-serif">
        <h1 className="text-5xl font-semibold mb-2">Sobre nosotros</h1>
        <p className="text-xl">Conoce al equipo detrás de todos tus viajes.</p>
        <p className="text-xl">
          ¿Tienes alguna duda?{' '}
          <a
            className="mb-1 text-teal-900 font-semibold"
            href="mailto:
					bugalink@gmail.com"
          >
            Ponte en contacto con nosotros
          </a>
          .
        </p>
        <People />
      </section>
    </Layout>
  );
}
