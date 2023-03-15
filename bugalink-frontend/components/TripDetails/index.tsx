import SourcePin from '/public/assets/source-pin.svg';
import TargetPin from '/public/assets/map-mark.svg';
import Dots from '/public/assets/dots.svg';

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
        <p className="text-xs">{date}</p>
      </div>
      <div className="mt-2 grid grid-cols-8 grid-rows-5 items-center justify-items-center text-sm">
        <span className="row-span-2 self-start justify-self-end font-bold">
          {originHour}
        </span>
        <div className=" row-span-5 flex h-full w-full flex-col items-center justify-between pt-1 pb-6">
          <SourcePin />
          <Dots className="h-10" />
          <TargetPin />
        </div>
        <span className="col-span-6 row-span-2">{origin}</span>

        <hr className="col-span-6 w-full text-border-color" />

        <span className="row-span-2 self-start justify-self-end font-bold">
          {destinationHour}
        </span>

        <span className="col-span-6 row-span-2">{destination}</span>
      </div>
      <hr className="mt-3 mb-3 w-full text-border-color" />
    </div>
  );
}
