import Link from 'next/link';

type Params = {
  text: string;
  link: string;
  Icon: any;
  numNotifications?: number;
};

export default function SquareButton({
  text,
  Icon,
  link,
  numNotifications = 0,
}: Params) {
  return (
    <Link href={link} className="relative w-full">
      <div className="flex justify-end overflow-hidden rounded-lg bg-white">
        {Icon}
      </div>
      <p className="text-center text-lg">{text}</p>
      {numNotifications > 0 && (
        <p className="absolute -left-3 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-light-red text-center text-lg font-semibold text-white">
          {numNotifications}
        </p>
      )}
    </Link>
  );
}
