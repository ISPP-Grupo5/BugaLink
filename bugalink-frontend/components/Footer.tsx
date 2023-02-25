import Logo from '/public/assets/Logo.svg';

export default function Footer() {
  return (
    <section className="flex flex-col sectionSize -mt-16 xl:-mt-0 bg-black text-white text-sm text-center font-montserrat">
      <div className="mb-4">
        <Logo className="w-28" alt="Logo" />
      </div>
      <p className="mb-1">
        ¿Tienes dudas? Contáctanos en{' '}
        <a
          className="font-medium underline"
          href="mailto:
					bugalink@gmail.com"
        >
          bugalink@gmail.com
        </a>
      </p>
      <div className="">© 2023 BugaLink. Todos los derechos reservados</div>
    </section>
  );
}
