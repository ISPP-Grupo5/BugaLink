import * as React from 'react';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import NEXT_ROUTES from '@/constants/nextRoutes';
import router from 'next/router';
import DialogComponent from '..';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type DialogBecomeDriverProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function DialogBecomeDriver({
  open,
  setOpen,
}: DialogBecomeDriverProps) {
  return (
    <DialogComponent
      title="Contenido no accesible"
      description="No tienes acceso a este contenido al no ser conductor. ¿Quieres hacerte conductor?"
      onClose={() => setOpen(false)}
      onCloseButton="Cancelar"
      onAccept={() => router.push(NEXT_ROUTES.BECOME_DRIVER)}
      onAcceptButton="Hazme conductor"
      open={open}
      setOpen={setOpen}
    />
  );
}
