import Link from 'next/link';
import cn from 'classnames';
import { useState } from 'react';
import DialogComponent from '@/components/dialog';
import router from 'next/router';
import NEXT_ROUTES from '@/constants/nextRoutes';

type Params = {
  text: string;
  link: string;
  Icon: any;
  disabled?: boolean;
  numNotifications?: number;
};

export default function SquareButton({
  text,
  Icon,
  link,
  disabled = false,
  numNotifications = 0,
}: Params) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <button disabled={disabled} className="relative w-full">
        <Link
          onClick={(e) => {
            if (disabled) {
              e.preventDefault();
              setOpenDialog(true);
            }
          }}
          href={link}
          className={cn(
            {
              'cursor-auto grayscale': disabled,
            },
            'flex justify-end overflow-hidden rounded-lg bg-white'
          )}
        >
          {Icon}
        </Link>
        {numNotifications > 0 && (
          <p className="absolute -left-3 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-light-red text-center text-lg font-semibold text-white">
            {numNotifications}
          </p>
        )}
        <p className="text-center text-lg">{text}</p>
      </button>
      {disabled && text === 'Solicitudes' && (
        <DialogComponent
          title="Contenido no accesible"
          description="No tienes acceso a este contenido al no ser conductor. ¿Quieres hacerte conductor?"
          onClose={() => setOpenDialog(false)}
          onCloseButton="Cancelar"
          onAccept={() => router.push(NEXT_ROUTES.BECOME_DRIVER)}
          onAcceptButton="Hazme conductor"
          open={openDialog}
          setOpen={setOpenDialog}
        />
      )}
    </>
  );
}
