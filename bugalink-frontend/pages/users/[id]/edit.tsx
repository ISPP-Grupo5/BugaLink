import Avatar from '@/components/avatar';
import { BackButtonText } from '@/components/buttons/Back';
import CTAButton from '@/components/buttons/CTA';
import DialogComponent from '@/components/dialog';
import TextField from '@/components/forms/TextField';
import AnimatedLayout from '@/components/layouts/animated';
import NEXT_ROUTES from '@/constants/nextRoutes';
import useUser from '@/hooks/useUser';
import UserI from '@/interfaces/user';
import { axiosAuth } from '@/lib/axios';
import { emitSuccess } from '@/utils/notifications';
import { GetServerSideProps } from 'next';
import { signOut } from 'next-auth/react';
import Pencil from 'public/assets/edit.svg';
import { useEffect, useRef, useState } from 'react';

interface FormErrors {
  name?: string;
  surname?: string;
}

interface FormValues {
  name: string;
  surname: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  const data = {
    id: id,
  };

  return {
    props: { data },
  };
};

export default function EditProfile({ data }) {
  const userId = data.id;

  const user = useUser(userId).user as UserI;

  useEffect(() => {
    if (!user) return;
    setName(user.first_name);
    setSurname(user.last_name);
    setPhotoURL(user.photo);
  }, [user]);

  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [file, setFile] = useState<File>();
  const [photoURL, setPhotoURL] = useState<string>('');

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDialogError, setOpenDialogError] = useState<boolean>(false);

  const [errors, setErrors] = useState<FormErrors>({});

  const formRef = useRef<HTMLFormElement>(null);

  const [isSendingForm, setIsSendingForm] = useState(false);

  const validateForm = (values: FormValues) => {
    const errors: FormErrors = {};

    if (!values.name) {
      errors.name = 'Por favor, ingrese su nombre';
    }

    if (!values.surname) {
      errors.surname = 'Por favor, ingrese sus apellidos';
    }

    setErrors(errors);

    return errors;
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsSendingForm(true);
    event.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const values: FormValues = {
        name: formData.get('name') as string,
        surname: formData.get('surname') as string,
      };

      const errors = validateForm(values);
      setErrors(errors);
      if (Object.keys(errors).length === 0) {
        // Aquí puedes hacer la llamada a la API o enviar los datos a donde los necesites
        const url = `users/${user.id}/edit`;

        const formData = new FormData();
        if (file !== undefined) formData.append('photo', file);
        formData.append('first_name', name);
        formData.append('last_name', surname);

        await axiosAuth
          .put(url, formData)
          .then((res) => {
            emitSuccess({
              message:
                'Perfil actualizado con éxito. Por favor, vuelva a iniciar sesión',
            });
            signOut({
              callbackUrl: NEXT_ROUTES.LOGIN,
            });
          })
          .catch((err) => {
            setOpenDialogError(true);
            setIsSendingForm(false);
          });
      } else {
        setIsSendingForm(false);
      }
    }
  };

  const handleDeleteConfirmation = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setOpenDialog(true);
  };

  const handleDeleteAccount = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    try {
      const response = await axiosAuth.delete(`/users/${user.id}`);
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
    <AnimatedLayout className="flex h-screen flex-col items-center justify-between bg-white">
      <BackButtonText text="Mi perfil" />
      <div className="flex h-full w-full flex-col items-center overflow-y-scroll">
        <div className="mb-5 h-24 w-24">
          <label
            htmlFor="uploadProfilePicture"
            className="relative mx-auto cursor-pointer"
          >
            <input
              id="uploadProfilePicture"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                  const img = document.getElementById(
                    'profilePicture'
                  ) as HTMLImageElement;
                  img.src = e.target.result as string;
                };
                reader.readAsDataURL(file);
                setFile(file);
                setPhotoURL(URL.createObjectURL(file));
              }}
            />
            <Avatar
              id="profilePicture"
              src={photoURL}
              className="my-2 w-full outline outline-8 outline-white"
            />
            <div id="check" className="absolute -bottom-2 -right-2">
              <div className="flex aspect-square h-10 w-10 rounded-full bg-turquoise">
                <Pencil className="p-1 text-white" />
              </div>
            </div>
          </label>
        </div>
        <form
          ref={formRef}
          className="flex h-full w-full flex-col items-center justify-between"
        >
          <div className="mt-5 flex w-full flex-col items-center space-y-6">
            <TextField
              fieldName="Nombre"
              name="name"
              content={name}
              setContent={setName}
              type="text"
              error={errors.name}
              parentClassName="w-10/12 flex flex-col items-center"
              inputClassName="w-full focus:text-black text-gray"
            />

            <TextField
              fieldName="Apellidos"
              name="surname"
              content={surname}
              setContent={setSurname}
              type="text"
              error={errors.surname}
              parentClassName="w-10/12 flex flex-col items-center"
              inputClassName="w-full focus:text-black text-gray"
            />
          </div>
          <div className="my-5 flex w-full flex-col items-center justify-center">
            <button className="text-red" onClick={handleDeleteConfirmation}>
              Solicita la eliminación de tu cuenta
            </button>
            <p className="mb-2 text-sm font-semibold text-gray">
              Usuario desde el{' '}
              {new Date(user?.date_joined).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <CTAButton
              className="w-11/12"
              text={isSendingForm ? 'PROCESANDO...' : 'GUARDAR'}
              onClick={handleSubmit}
            />
          </div>
        </form>
      </div>
      <DialogComponent
        title="Eliminar mi cuenta"
        description="Vas a eliminar tu cuenta, ¿estás seguro?"
        onClose={() => setOpenDialog(false)}
        onCloseButton="Cancelar"
        onAccept={handleDeleteAccount}
        onAcceptButton="Eliminar cuenta"
        open={openDialog}
        setOpen={setOpenDialog}
      />
      <DialogComponent
        title="Error al editar el perfil"
        description="Ha ocurrido un error al editar el perfil, por favor, inténtelo de nuevo más tarde."
        onClose={() => setOpenDialogError(false)}
        onCloseButton="Cerrar"
        open={openDialogError}
        setOpen={setOpenDialogError}
      />
    </AnimatedLayout>
  );
}
