import AnimatedLayout from '@/components/layouts/animated';
import { BackButton } from '@/components/buttons/Back';
import CTAButton from '@/components/buttons/CTA';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ExternalLogin from '@/components/externalLogin';
import TextField from '@/components/forms/TextField';
import RegisterImg from '/public/assets/register.svg';
import axios from '@/lib/axios';

import { signIn, useSession } from 'next-auth/react';
import NEXT_ROUTES from '@/constants/nextRoutes';
import router from 'next/router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [registerStatus, setRegisterStatus] = useState<number>();

  const { status } = useSession();
  useEffect(() => {
    if (status === 'authenticated') router.push(NEXT_ROUTES.HOME);
  }, [status]);

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await axios.post('/auth/registration', {
      email,
      password1: password,
      password2: password,
      first_name: name,
      last_name: surname,
    });
    setRegisterStatus(response.status);
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
                text="REGISTRARSE"
                className="mt-8 w-5/6"
                onClick={handleRegister}
              />

              <span className="flex flex-row justify-center -justify-between py-8">
                <p className="font-light text-gray">¿Ya tienes una cuenta?</p>
                <Link href={NEXT_ROUTES.LOGIN} className="translate-x-2">
                  <p className="text-dark-turquoise"> Iniciar sesión </p>
                </Link>
              </span>

              <span className="flex flex-row justify-center -justify-between py-4">
                <p className="font-light text-gray">
                  Al registrarte se considera que aceptas los
                  <Link href="https://www.bugalink.es/terms" className="translate-x-2">
                    <p className="text-dark-turquoise font-bold">
                      {' '}
                      Términos y condiciones{' '}
                    </p>
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
