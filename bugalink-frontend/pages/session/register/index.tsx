import AnimatedLayout from '@/components/layouts/animated';
import { BackButton } from '@/components/buttons/Back';
import CTAButton from '@/components/buttons/CTA';
import Link from 'next/link';
import { useState } from 'react';
import ExternalLogin from '@/components/externalLogin';
import TextField from '@/components/forms/TextField';
import RegisterImg from '/public/assets/register.svg';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  return (
    <AnimatedLayout className="bg-white">
      <BackButton className="absolute left-2 top-2 bg-base-origin py-3 pr-2 shadow-xl" />
      <div className="flex flex-col -space-y-5">
        <span className="flex w-full justify-center bg-light-gray">
          <RegisterImg className="bg-light-gray" />
        </span>
        <div className="z-10 rounded-t-3xl bg-base-origin text-center">
          <p className=" py-5 text-3xl text-gray ">Crear cuenta nueva</p>
          <div className=" h-max rounded-t-3xl bg-white py-5">
            <ExternalLogin />
            <p className="font-bold text-light-gray">
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
                <TextField
                  type={'text'}
                  content={name}
                  fieldName={'Nombre'}
                  inputClassName="w-full"
                  parentClassName=""
                  setContent={setName}
                />
                <TextField
                  type={'password'}
                  content={password}
                  fieldName={'Contraseña'}
                  inputClassName="w-full"
                  parentClassName=""
                  setContent={setPassword}
                />
              </div>
              <CTAButton text="REGISTRARSE" className="mt-8 w-5/6" />

              <span className="flex flex-row justify-center -justify-between py-8">
                <p className="font-bold text-light-gray">
                  ¿Ya tienes una cuenta?
                </p>
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
