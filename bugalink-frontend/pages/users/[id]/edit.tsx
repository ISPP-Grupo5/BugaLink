import Avatar from '@/components/avatar';
import { BackButtonText } from '@/components/buttons/Back';
import CTAButton from '@/components/buttons/CTA';
import TextField from '@/components/forms/TextField';
import AnimatedLayout from '@/components/layouts/animated';
import NEXT_ROUTES from '@/constants/nextRoutes';
import useUser from '@/hooks/useUser';
import UserI from '@/interfaces/user';
import { axiosAuth } from '@/lib/axios';
import { GetServerSideProps } from 'next';
import { signOut } from 'next-auth/react';
import Pencil from 'public/assets/edit.svg';
import { useEffect, useRef, useState } from 'react';

interface FormErrors {
  name?: string;
  surname?: string;
  email?: string;
  password?: string;
}

interface FormValues {
  name: string;
  surname: string;
  email: string;
  password: string;
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
    setEmail(user.email);
  }, [user]);
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const formRef = useRef<HTMLFormElement>(null);

  const validateForm = (values: FormValues) => {
    const errors: FormErrors = {};

    if (!values.name) {
      errors.name = 'Por favor, ingrese su nombre';
    }

    if (!values.surname) {
      errors.surname = 'Por favor, ingrese sus apellidos';
    }

    const emailRegex = /^\S+@\S+$/i;
    if (!values.email) {
      errors.email = 'Por favor, ingrese su correo electrónico';
    } else if (!emailRegex.test(values.email)) {
      errors.email = 'Por favor, ingrese un correo electrónico válido';
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (!values.password) {
      errors.password = 'La contraseña es obligatoria';
    } else if (values.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (values.password.length > 20) {
      errors.password = 'La contraseña debe tener menos de 20 caracteres';
    } else if (values.password.includes('contraseña')) {
      errors.password =
        'La contraseña no puede contener la palabra "contraseña"';
    } else if (!passwordRegex.test(values.password)) {
      errors.password =
        'La contraseña debe tener al menos una mayúscula, una minúscula, un número y un símbolo.';
    }

    setErrors(errors);

    return errors;
  };

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const values: FormValues = {
        name: formData.get('name') as string,
        surname: formData.get('surname') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      };

      const errors = validateForm(values);
      setErrors(errors);
      if (Object.keys(errors).length === 0) {
        // Aquí puedes hacer la llamada a la API o enviar los datos a donde los necesites
        console.log(
          'Los datos del formulario son válidos. ¡Enviando formulario!'
        );
      }
    }
  };

  const handleDeleteConfirmation = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setIsDeleteConfirmation(true);
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
    <AnimatedLayout className="justify-between flex h-screen flex-col items-center bg-white">
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
                // Set to state
              }}
            />
            <Avatar
              id="profilePicture"
              src={user.photo}
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
          className="justify-between flex h-full w-full flex-col items-center"
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

            <hr className="mx-2 w-11/12 text-light-gray" />

            <TextField
              fieldName="Correo electrónico"
              name="email"
              content={email}
              setContent={setEmail}
              type="email"
              error={errors.email}
              disabled
              parentClassName="w-10/12 flex flex-col items-center"
              inputClassName="w-full focus:text-black text-gray"
            />

            <TextField
              fieldName="Contraseña"
              name="password"
              content={password}
              setContent={setPassword}
              type="password"
              error={errors.password}
              parentClassName="w-10/12 flex flex-col items-center"
              inputClassName="w-full focus:text-black text-gray"
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          </div>
          <div className="my-5 flex w-full flex-col items-center justify-center">
            {isDeleteConfirmation ? (
              <button className="text-red" onClick={handleDeleteAccount}>
                Pulsa de nuevo para eliminar tu cuenta
              </button>
            ) : (
              <button className="text-red" onClick={handleDeleteConfirmation}>
                Solicita la eliminación de tu cuenta
              </button>
            )}
            <p className="mb-2 text-sm font-semibold text-gray">
              Usuario desde el{' '}
              {new Date(user.date_joined).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <CTAButton
              className="w-11/12"
              text="GUARDAR"
              onClick={handleSubmit}
            />
          </div>
        </form>
      </div>
    </AnimatedLayout>
  );
}
