import Link from 'next/link';
import ArrowRightWhite from '/public/assets/arrow-right-white.svg';

type PayMethodProps = {
  logo: any;
  name: string;
  data: string;
  href: string;
};

export default function PayMethod({ logo, name, data, href }: PayMethodProps) {
  return (
    <div className="my-2 grid h-32 w-full grid-cols-3 items-center justify-center rounded-xl border border-light-gray p-2 shadow-md">
      <div
        className={`m-auto h-4/6 rounded-xl p-4 ${
          name == 'Saldo' ? 'bg-turquoise' : 'bg-light-gray'
        }`}
      >
        {logo}
      </div>
      <div>
        <p className="text-lg font-bold">{name}</p>
        <p className="text-sm text-gray">{data}</p>
      </div>
      <div className="ml-auto mr-1">
        <Link href={href}>
          <p
            className={` rounded-xl px-2 py-3 ${
              name == 'Saldo' ? 'bg-turquoise' : 'bg-black'
            }`}
          >
            <ArrowRightWhite />
          </p>
        </Link>
      </div>
    </div>
  );
}
