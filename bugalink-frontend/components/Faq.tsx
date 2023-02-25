export default function Faq() {
  return (
    <section className="sectionSize bg-black text-white">
      <div className="mt-4 px-4 mx-auto max-w-screen-xl">
        <h2 className="mb-8 text-4xl tracking-tight font-extrabold text-white">
          Preguntas frecuentes
        </h2>
        <div className="grid pt-8 text-left border-t border-gray-200 md:gap-16 md:grid-cols-2">
          <div>
            <Question
              title="¿Cómo funciona BugaLink?"
              answer="BugaLink es una aplicación de Carpooling que conecta a conductores con pasajeros que hacen las mismas rutas con frecuencia. Los conductores ofrecen asientos libres en sus vehículos y los pasajeros pueden reservarlos a través de la aplicación."
            />
            <Question
              title="¿Cómo puedo saber si hay viajes disponibles para mi ruta habitual?"
              answer="Lo único que tienes que hacer es crear tu horario de viajes frecuentes dentro de la aplicación y se te mostrarán los viajes que hayan publicado otros conductores de BugaLink para ese trayecto."
            />
            <Question
              title="¿Puedo cancelar un viaje después de reservarlo?"
              answer="Sí, puedes cancelar un viaje antes de la hora de salida programada siempre y cuando sea con suficiente antelación o el conductor no haya aceptado tu solicitud de reserva. En caso de que el conductor haya aceptado tu solicitud, deberás ponerte en contacto con él para cancelar el viaje."
            />
            <Question
              title="¿Qué sucede si llego tarde al lugar de encuentro acordado?"
              answer="Si prevees llegas tarde al lugar de encuentro acordado, debes informar al conductor lo antes posible a través de la aplicación. BugaLink pone a tu disposición un chat para que puedas comunicarte con el conductor y el resto de pasajeros."
            />
          </div>
          <div>
            <Question
              title="¿Es seguro usar BugaLink?"
              answer="Sí, la seguridad es nuestra máxima prioridad. Todos los usuarios de BugaLink pasan por un proceso de verificación de identidad, carnet de conducir y seguro de coche antes de poder usar la aplicación. Además, puedes ver el perfil de otros usuarios para conocer las experiencias que han tenido con la comunidad."
            />
            <Question
              title="¿Cómo se calcula el precio de cada viaje?"
              answer="El precio por asiento lo establece el conductor, y puede ser modificado en cualquier momento tras publicar la oferta. Una vez el conductor acepte tu solicitud de reserva, el precio del viaje para ese pasajero está garantizado."
            />
            <Question
              title="¿Qué pasa si un conductor no se presenta en el lugar de encuentro acordado?"
              answer="Si un conductor no se presenta en el lugar de encuentro acordado, debes informar inmediatamente a BugaLink a través de la aplicación. Evaluaremos la situación y tomaremos medidas apropiadas para resolver el problema."
            />
            <Question
              title="¿Qué debo hacer si tengo problemas con otro usuario de BugaLink?"
              answer="Si tienes algún problema con otro usuario de BugaLink, puedes informarnos a través de la aplicación. Tras cada viaje se te pedirá que evalúes al conductor y a los pasajeros con los que hayas compartido el viaje. Además, puedes ponerte en contacto con nosotros a través de la sección de soporte de la aplicación."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const Question = ({ title, answer }) => {
  return (
    <div className="mb-10">
      <h3 className="flex items-center mb-4 text-lg font-medium text-white">
        <svg
          className="flex-shrink-0 mr-2 w-5 h-5 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          ></path>
        </svg>
        {title}
      </h3>
      <p className="text-gray-400">{answer}</p>
    </div>
  );
};
