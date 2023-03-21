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
    <div className="flex flex-row place-content-center justify-between space-x-2">
      <div className="flex scale-90 flex-row -space-x-16">
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

      <div className="w-2/4 text-ellipsis py-4">
        <p className=" text-base text-black">{people}</p>
        <p className="text-base text-light-gray">
          {travelType} - {date}
        </p>
      </div>

      <div className="py-4 -translate-x-4">
        <p className={'text-right text-base font-bold ' + className}>{money}</p>
        {isPending == true && (
          <p className="text-base text-yellow">Pendiente</p>
        )}
      </div>
    </div>
  );
}
