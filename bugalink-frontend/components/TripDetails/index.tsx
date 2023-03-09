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
        <p className="text-xs">
          {date}
        </p>
      </div>
      <div className="grid justify-items-center items-center grid-cols-8 grid-rows-5 mt-2 text-sm">
        <span className="font-bold self-start justify-self-end row-span-2">
          {originHour}
        </span>
        <div className=" h-full w-full flex flex-col items-center justify-between pt-1 pb-6 row-span-5">
          <SourcePin />
          <Dots className="h-10" />
          <TargetPin />
        </div>
        <span className="col-span-6 row-span-2">
          {origin}
        </span>

        <hr className="col-span-6 w-full text-border-color" />

        <span className="font-bold self-start justify-self-end row-span-2">
          {destinationHour}
        </span>

        <span className="col-span-6 row-span-2">
          {destination}
        </span>
      </div>
      <hr className="mt-3 mb-3 w-full text-border-color" />
    </div>
  );
}
