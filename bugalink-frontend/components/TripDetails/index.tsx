import SourcePin from '/public/assets/source-pin.svg';
import TargetPin from '/public/assets/map-mark.svg';
import Dots from '/public/assets/dots.svg';

export default function TripDetails() {
  return (
    <div>
      {/* Details */}
      <div className="py-2">
        <p className="text-xs">
          Cada viernes a partir del 16 de febrero de 2023
        </p>
      </div>
      <div className="grid justify-items-center items-center grid-cols-8 grid-rows-5 mt-2 text-sm">
        <span className="font-bold self-start justify-self-end row-span-2">
          21:00
        </span>
        <div className=" h-full w-full flex flex-col items-center justify-between pt-1 pb-6 row-span-5">
          <SourcePin />
          <Dots className="h-10" />
          <TargetPin />
        </div>
        <span className="col-span-6 row-span-2">
          Escuela Técnica Superior de Ingeniería Informática (ETSII), 41002
          Sevilla
        </span>

        <hr className="col-span-6 w-full text-border-color" />

        <span className="font-bold self-start justify-self-end row-span-2">
          21:15
        </span>

        <span className="col-span-6 row-span-2">
          Avenida de Andalucía, 35, Dos Hermanas, 41002 Sevilla
        </span>
      </div>
      <hr className="mt-3 mb-3 w-full text-border-color" />
    </div>
  );
}
