import { BackButton } from '@/components/buttons/Back';
import CTAButton from '@/components/buttons/CTA';
import ExternalLogin from '@/components/externalLogin';
import TextField from '@/components/forms/TextField';
import AnimatedLayout from '@/components/layouts/animated';
import axios from '@/lib/axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import RegisterImg from '/public/assets/register.svg';

import NEXT_ROUTES from '@/constants/nextRoutes';
import { signIn } from 'next-auth/react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [registerStatus, setRegisterStatus] = useState<number>();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post('/auth/registration', {
        email,
        password1: password,
        password2: password,
        first_name: name,
        last_name: surname,
      });
      setRegisterStatus(response.status);
    } catch (error) {
      setErrors(error.response.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!registerStatus) return;
    const handleRegisterRedirect = async () => {
      await signIn('credentials', {
        email,
        password,
        redirect: true,
        callbackUrl: '/',
      });
    };

    if (registerStatus === 204) handleRegisterRedirect();
    else alert('Error al registrarse');
  }, [registerStatus]);

  return (
    <AnimatedLayout className="bg-white">
      <div className="flex flex-col -space-y-5">
        <span className="flex w-full justify-center bg-light-gray">
          <RegisterImg className="bg-light-gray" />
        </span>
        <div className="z-10 rounded-t-3xl bg-base-origin text-center">
          <p className=" py-5 text-3xl text-gray ">Crear cuenta nueva</p>
          <div className="rounded-t-xl bg-white py-5">
            <ExternalLogin />
            <p className="font-light text-gray opacity-70">
              o usa tu cuenta de correo
            </p>
            <form className="mt-5">
              <div className="mr-8 ml-8 flex flex-col space-y-5">
                <TextField
                  type={'text'}
                  content={email}
                  fieldName={'Correo electrónico'}
                  inputClassName="w-full"
                  parentClassName=""
                  setContent={setEmail}
                />
                <span className="flex space-x-2">
                  <TextField
                    type={'text'}
                    content={name}
                    fieldName={'Nombre'}
                    inputClassName="w-full"
                    parentClassName=""
                    setContent={setName}
                  />
                  <TextField
                    type={'text'}
                    content={surname}
                    fieldName={'Apellidos'}
                    inputClassName="w-full"
                    parentClassName=""
                    setContent={setSurname}
                  />
                </span>
                <TextField
                  type={'password'}
                  content={password}
                  fieldName={'Contraseña'}
                  inputClassName="w-full"
                  parentClassName=""
                  setContent={setPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
              </div>
              <CTAButton
                text={isLoading ? 'PROCESANDO...' : 'REGISTRARSE'}
                className="mt-2 w-5/6"
                onClick={handleRegister}
                disabled={isLoading}
              />
              {errors &&
                Object.keys(errors).map((key) => {
                  return (
                    <p className="mt-1 text-center text-red" key={key}>
                      {key}: {errors[key]}
                    </p>
                  );
                })}

              <span className="flex flex-col items-center pt-2">
                <p className="font-light text-gray">
                  Al registrarte aceptas nuestros{' '}
                  <a
                    href="https://www.bugalink.es/terms"
                    className="font-normal text-dark-turquoise"
                  >
                    Términos y condiciones
                  </a>
                </p>
                <p className="font-light text-gray">
                  ¿Ya tienes una cuenta?{' '}
                  <Link
                    href={NEXT_ROUTES.LOGIN}
                    className="font-normal text-dark-turquoise"
                  >
                    Iniciar sesión
                  </Link>
                </p>
              </span>
            </form>
          </div>
        </div>
      </div>
    </AnimatedLayout>
  );
}
