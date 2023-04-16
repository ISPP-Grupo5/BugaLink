import DialogNotAvailable from '@/components/dialogs/notAvailable';
import Link from 'next/link';
import { useState } from 'react';

type Params = {
  Icon: any;
  href: string;
};

export default function RoundedButton({ Icon, href }: Params) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Link href={href} className="rounded-full border-2 border-light-gray">
        <button className="h-10 w-10" onClick={() => setOpenDialog(true)}>
          {Icon}
        </button>
      </Link>
      <DialogNotAvailable open={openDialog} setOpen={setOpenDialog} />
    </>
  );
}
