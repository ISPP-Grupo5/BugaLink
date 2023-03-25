import Link from 'next/link';

type Params = {
  link: string;
  Icon: any;
};

export default function RoundedButton({ Icon, link }: Params) {
  return (
    <Link href={link} className="rounded-full border-2 border-light-gray">
      <button className="h-10 w-10">{Icon}</button>
    </Link>
  );
}
