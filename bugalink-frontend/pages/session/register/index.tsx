import AnimatedLayout from '@/components/layouts/animated';
import { BackButton } from '@/components/buttons/Back';
import CTAButton from '@/components/buttons/CTA';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import ExternalLogin from '@/components/externalLogin';
import TextField from '@/components/forms/TextField';
import RegisterImg from '/public/assets/register.svg';
import axios from '@/lib/axios';
import useAuth from '@/hooks/useAuth';

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

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [registerStatus, setRegisterStatus] = useState();
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

  const { login } = useAuth();

  // const handleRegister = async (e) => {
  //   e.preventDefault();
    // const { data } = await axios.post('/auth/registration', {
    //   email,
    //   password1: password,
    //   password2: password,
    //   first_name: name,
    //   last_name: surname,
    // });
    // setRegisterStatus(data.status);
  // };

  const handleRegister = async (e) => {
    e.preventDefault();
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
        const { data } = await axios.post('/auth/registration', {
          email,
          password1: password,
          password2: password,
          first_name: name,
          last_name: surname,
        });
        console.log(data.status)
        setRegisterStatus(data.status);
      }
    }
  };

  useEffect(() => {
    if (!registerStatus) return;
    const handleRegisterRedirect = async () => {
      await login(email, password);
    };

    if (registerStatus === 201) handleRegisterRedirect();
    else alert('Error al registrarse');
  }, [registerStatus]);

  return (
    <AnimatedLayout className="bg-white">
      <BackButton className="absolute left-2 top-2 bg-base-origin py-3 pr-2 shadow-xl" />
      <div className="flex flex-col -space-y-5">
        <span className="flex w-full justify-center bg-light-gray">
          <RegisterImg className="bg-light-gray" />
        </span>
        <div className="z-10 rounded-t-3xl bg-base-origin text-center">
          <p className=" py-5 text-3xl text-gray ">Crear cuenta nueva</p>
          <div className="h-max rounded-t-3xl bg-white py-5">
            <ExternalLogin />
            <p className="mt-2 font-light text-gray">
              o usa tu cuenta de correo
            </p>
            <form ref={formRef} className="mt-5">
              <div className="mr-8 ml-8 flex flex-col space-y-5">
                <TextField
                  name="email"
                  type={'text'}
                  content={email}
                  fieldName={'Correo electrónico'}
                  inputClassName="w-full"
                  parentClassName="w-full flex flex-col items-center"
                  error={errors.email}
                  setContent={setEmail}
                />
                <span className="flex space-x-2">
                  <TextField
                    name="name"
                    type={'text'}
                    content={name}
                    fieldName={'Nombre'}
                    inputClassName="w-full"
                    parentClassName="w-full flex flex-col items-center"
                    setContent={setName}
                    error={errors.name}
                  />
                  <TextField
                    name="surname"
                    type={'text'}
                    content={surname}
                    fieldName={'Apellidos'}
                    inputClassName="w-full"
                    parentClassName="w-full flex flex-col items-center"
                    setContent={setSurname}
                    error={errors.surname}
                  />
                </span>
                <TextField
                  name="password"
                  type={'password'}
                  content={password}
                  fieldName={'Contraseña'}
                  inputClassName="w-full"
                  parentClassName="w-full flex flex-col items-center"
                  setContent={setPassword}
                  showPassword={showPassword}
                  error={errors.password}
                  setShowPassword={setShowPassword}
                />
              </div>
              <CTAButton
                text="REGISTRARSE"
                className="mt-8 w-5/6"
                onClick={handleRegister}
              />

              <span className="flex flex-row justify-center -justify-between py-8">
                <p className="font-light text-gray">¿Ya tienes una cuenta?</p>
                <Link href="/session/login" className="translate-x-2">
                  <p className="text-dark-turquoise"> Iniciar sesión </p>
                </Link>
              </span>
            </form>
          </div>
        </div>
      </div>
    </AnimatedLayout>
  );
}
