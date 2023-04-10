import TargetPin from '/public/assets/map-mark.svg';
import SourcePin from '/public/assets/source-pin.svg';

type Params = {
  date: string;
  originHour: string;
  destinationHour: string;
  origin: string;
  destination: string;
};

export default function TripDetails({
  date,
  originHour,
  destinationHour,
  origin,
  destination,
}: Params) {
  return (
    <div>
      {/* Details */}
      <div className="py-2">
        <p className="text-md">{date}</p>
      </div>
      <div className="text-md mt-2 grid grid-cols-8 grid-rows-1 items-center justify-items-center">
        <span className="row-span-2 self-start justify-self-end font-bold">
          {originHour}
        </span>
        <SourcePin className="mt-1.5 h-3.5 w-3.5 self-start" />
        <span className="col-span-6">{origin}</span>
      </div>
      <hr className="col-span-7 my-2 w-full text-border-color" />
      <div className="text-md mt-2 grid grid-cols-8 grid-rows-1 items-center justify-items-center">
        <span className="row-span-2 self-start justify-self-end font-bold">
          {destinationHour}
        </span>
        <TargetPin className="mt-1.5 h-3.5 w-3.5 self-start" />
        <span className="col-span-6 place-self-start">{destination}</span>
      </div>
      <hr className="mt-3 mb-3 w-full text-border-color" />
    </div>
  );
}
