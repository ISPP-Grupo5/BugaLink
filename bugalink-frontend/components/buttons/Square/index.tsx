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
      <div className="bg-baseOrigin">{Icon}</div>
      <p className="text-lg text-center">{text}</p>
      {numNotifications > 0 && (
        <p className="absolute bg-light-red w-7 h-7 rounded-full text-white text-center -left-2 -top-2">
          {numNotifications}
        </p>
      )}
    </Link>
  );
}
