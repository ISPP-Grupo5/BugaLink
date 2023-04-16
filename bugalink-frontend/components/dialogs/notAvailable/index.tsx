import * as React from 'react';
import DialogComponent from '..';

type DialogNotAvailableProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function DialogNotAvailable({
  open,
  setOpen,
}: DialogNotAvailableProps) {
  return (
    <DialogComponent
      title="Funcionalidad no disponible"
      description="Esta funcionalidad no está disponible en la versión actual de la aplicación."
      onClose={() => setOpen(false)}
      onCloseButton="Entendido"
      open={open}
      setOpen={setOpen}
    />
  );
}
