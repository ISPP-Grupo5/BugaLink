import * as React from 'react';
import DialogComponent from '..';

type DialogConfirmationProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onClose?: () => void;
};

export default function DialogConfirmation({
  open,
  setOpen,
  onClose,
}: DialogConfirmationProps) {
  return (
    <DialogComponent
      title="Acción realizada"
      description="La acción se ha realizado correctamente."
      onClose={onClose}
      onCloseButton="Entendido"
      open={open}
      setOpen={setOpen}
    />
  );
}
