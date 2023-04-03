import { BackButtonText } from '@/components/buttons/Back';
import CTAButton from '@/components/buttons/CTA';
import TextField from '@/components/forms/TextField';
import AnimatedLayout from '@/components/layouts/animated';
import Avatar from 'public/assets/avatar.svg';
import Pencil from 'public/assets/edit.svg';
import { useRef, useState } from 'react';

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

export default function EditProfile() {
  const [name, setName] = useState<string>('Pedro');
  const [surname, setSurname] = useState<string>('Pérez');
  const [email, setEmail] = useState<string>('pedroperez@mail.com');
  const [password, setPassword] = useState<string>('password1D3!');

  const [showPassword, setShowPassword] = useState<boolean>(false);
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

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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

  return (
    <AnimatedLayout className="flex h-screen flex-col items-center justify-center bg-white">
      <BackButtonText text="Mi perfil" />
      <div className="flex h-full w-full flex-col items-center overflow-y-scroll pb-32">
        <div className="z-10 mb-5 rounded-t-3xl text-center">
          <div className="relative mx-auto w-min">
            <Avatar className="mx-auto my-2 h-24 w-24 rounded-full outline outline-8 outline-white" />
            <div id="check" className="absolute -bottom-2 -right-2">
              <div className="flex aspect-square w-9 items-center justify-center rounded-full bg-turquoise">
                <Pencil className="m-auto aspect-square bg-transparent p-1 text-white" />
              </div>
            </div>
          </div>
          <p className="pt-2 text-3xl ">Pedro Pérez</p>
        </div>
        <form ref={formRef} className="flex w-full flex-col items-center">
          <div className="mt-5 flex w-full flex-col items-center space-y-6">
            <TextField
              fieldName="Nombre"
              name="name"
              content={name}
              setContent={setName}
              type="text"
              error={errors.name}
              parentClassName="w-10/12 flex flex-col items-center"
              inputClassName="w-full focus:text-black text-light-gray"
            />

            <TextField
              fieldName="Apellidos"
              name="surname"
              content={surname}
              setContent={setSurname}
              type="text"
              error={errors.surname}
              parentClassName="w-10/12 flex flex-col items-center"
              inputClassName="w-full focus:text-black text-light-gray"
            />

            <hr className="mx-2 w-11/12 text-light-gray" />

            <TextField
              fieldName="Correo electrónico"
              name="email"
              content={email}
              setContent={setEmail}
              type="email"
              error={errors.email}
              parentClassName="w-10/12 flex flex-col items-center"
              inputClassName="w-full focus:text-black text-light-gray"
            />

            <TextField
              fieldName="Contraseña"
              name="password"
              content={password}
              setContent={setPassword}
              type="password"
              error={errors.password}
              parentClassName="w-10/12 flex flex-col items-center"
              inputClassName="w-full focus:text-black text-light-gray"
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          </div>
          <div className="absolute bottom-2 mt-5 flex w-full flex-col items-center justify-center space-y-6 bg-white pt-3">
            <p className="text-sm font-semibold text-gray">
              Usuario desde el 22 de marzo de 2023
            </p>
            <CTAButton
              className="w-11/12"
              text="GUARDAR"
              onClick={handleButtonClick}
            />
          </div>
        </form>
      </div>
    </AnimatedLayout>
  );
}
