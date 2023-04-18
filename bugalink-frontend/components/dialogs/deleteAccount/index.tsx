import * as React from 'react';
import NEXT_ROUTES from '@/constants/nextRoutes';
import { axiosAuth } from '@/lib/axios';
import { signOut } from 'next-auth/react';
import DialogComponent from '..';

type DialogDeleteAccountProps = {
  userId: number;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function DialogDeleteAccount({
  userId,
  open,
  setOpen,
}: DialogDeleteAccountProps) {
  const handleDeleteAccount = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    try {
      const response = await axiosAuth.delete(`/users/${userId}`);
      if (response.status === 204) {
        await signOut({
          callbackUrl: NEXT_ROUTES.LOGIN,
        });
      }
    } catch (error) {
      alert(error?.response?.data?.error || 'Error al eliminar la cuenta');
    }
  };

  return (
    <DialogComponent
      title="Eliminar mi cuenta"
      description="Vas a eliminar tu cuenta, ¿estás seguro?"
      onClose={() => setOpen(false)}
      onCloseButton="Cancelar"
      onAccept={handleDeleteAccount}
      onAcceptButton="Eliminar cuenta"
      open={open}
      setOpen={setOpen}
    />
  );
}
