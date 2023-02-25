import axios from 'axios';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import Typewriter from 'typewriter-effect';
import Hand from './Hand';

const TYPEWRITER_WORDS = ['gastos', 'problemas', 'estrés', 'polución'];

export default function Hero() {
  return (
    <section
      id="/"
      className="pt-24 md:mt-0 md:h-screen flex flex-col justify-center text-center md:text-left md:flex-row md:justify-between md:items-center lg:px-48 md:px-12 px-4 bg-secondary font-montserrat overflow-clip"
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 1, ease: 'easeInOut' }}
        className="text-left md:flex-1 md:mr-10"
      >
        <h1 className="md:w-80 flex flex-col md:flex-row text-5xl xl:text-6xl font-pt-serif font-bold mb-2">
          <p className="mr-3">Adiós</p>
          <Typewriter
            options={{
              strings: TYPEWRITER_WORDS,
              autoStart: true,
              loop: true,
              deleteSpeed: 60,
              cursor: '',
            }}
          />
        </h1>
        <h1 className="flex flex-col md:flex-row font-pt-serif text-5xl xl:text-6xl font-bold mb-7">
          Hola <span className="md:ml-3 text-teal-900">carpooling</span>
        </h1>
        <p className="xl:text-lg xl:w-4/5 mb-10">
          Somos una comunidad de viajeros comprometidos con reducir el tráfico,
          el gasto y las emisiones. Encuentra a otros usuarios que compartan tu
          misma ruta y haz que tus viajes sean más inteligentes.
        </p>
        <NewsletterForm />
      </motion.div>
      <Hand />
    </section>
  );
}

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSent(false);
    setError(false);
    // send the email to the backend https://bugalink.pythonanywhere.com/newsletter:
    const options = {
      method: 'POST',
      url: 'https://bugalink.pythonanywhere.com/newsletter/',
      headers: { 'Content-Type': 'application/json' },
      withCredentials: false,
      data: { email },
    };

    axios
      .request(options)
      .then(function (response) {
        setIsSent(true);
        // The server will return "False" if the email is already in the database
        response.data === 'False' ? setError(true) : setError(false);
      })
      .catch(function (error) {
        setError(true);
      });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`transition-transform duration-300 ${
          isSent && !error ? 'scale-y-0 -translate-y-10' : 'scale-y-100'
        }`}
      >
        <p className="mb-2">
          ¿Quieres recibir las últimas noticias sobre BugaLink?
        </p>
        <div className="flex -space-x-3">
          {/* Email icon inside the input */}
          <span className="w-full xl:w-2/3 2xl:w-1/2">
            <Image
              className="absolute ml-5 mt-5"
              src="/assets/logos/Mail.svg"
              alt="Email"
              width={20}
              height={20}
            />
            <input
              className="w-full bg-white pl-12 pr-6 py-4 rounded-lg border-2 border-black border-solid mr-2 mb-2"
              type="email"
              placeholder="Introduce tu email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </span>
          <button className="bg-black px-6 py-4 rounded-lg border-2 border-black border-solid text-white mr-2 mb-2">
            Enviar
          </button>
        </div>
      </form>
      {error ? (
        <p
          className={`transition-transform duration-300 text-red-500
					${isSent ? 'scale-y-100' : 'scale-y-0'}`}
        >
          ¡Ups! Algo salió mal. Puede que ya estés suscrito.
        </p>
      ) : (
        <p
          className={`transition-transform duration-300 text-teal-900 
					${isSent ? 'scale-y-100 -translate-y-24' : 'invisible scale-y-0'}`}
        >
          ¡Gracias por suscribirte, te mantendremos al tanto!
        </p>
      )}
    </>
  );
};
