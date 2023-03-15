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
    <Link href={link} className="relative">
      <div className="bg-base-origin">{Icon}</div>
      <p className="text-center text-lg">{text}</p>
      {numNotifications > 0 && (
        <p className="absolute -left-4 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-light-red text-center text-xl font-semibold   text-white">
          {numNotifications}
        </p>
      )}
    </Link>
  );
}
