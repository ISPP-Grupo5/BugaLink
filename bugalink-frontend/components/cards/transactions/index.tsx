type Params = {
  people: string;
  travelType?: string;
  date: string;
  className: string;
  money: string;
  isPending?: boolean;
  Icon: string;
  Icon2?: string;
  Icon3?: string;
};

export default function Transaction({
  people,
  travelType,
  date,
  className,
  money,
  isPending = false,
  Icon,
  Icon2,
  Icon3,
}: Params) {
  return (
    <div className="grid grid-cols-4 place-content-center justify-between space-x-2">
      <div className="col-span-1 mx-auto flex scale-90 flex-row -space-x-16">
        {Icon2 != null && (
          <img
            src={Icon2}
            className="z-20 h-20 w-20 scale-75 object-scale-down"
          />
        )}
        <img src={Icon} className="z-10 h-20 w-20 scale-75 object-scale-down" />
        {Icon3 != null && (
          <img
            src={Icon3}
            className="z-0 h-20 w-20 scale-75 object-scale-down"
          />
        )}
      </div>

      <div className="col-span-2 text-ellipsis py-4">
        <p className=" text-lg font-bold text-black">{people}</p>
        <p className="text-base text-gray">
          {travelType} - {date}
        </p>
      </div>

      <div className="col-span-1 my-auto mx-auto pr-3 text-right ">
        <p className={'text-lg font-bold ' + className}>{money}</p>
        {isPending && <p className="text-base text-yellow">Pendiente</p>}
      </div>
    </div>
  );
}
