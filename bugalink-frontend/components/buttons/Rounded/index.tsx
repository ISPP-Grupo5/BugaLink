import Link from 'next/link';

type Params = {
  Icon: any;
  href: string;
};

export default function RoundedButton({ Icon, href }: Params) {
  return (
    <Link href={href} className="rounded-full border-2 border-light-gray">
      <button className="h-10 w-10">{Icon}</button>
    </Link>
  );
}
