import AnimatedLayout from '../../../components/layouts/animated';
import { BackButton } from '../../../components/buttons/Back';
import CTAButton from '@/components/buttons/CTA';
import Link from 'next/link';
import { useState } from 'react';
import Switch from '@/components/forms/Switch';
import ExternalLogin from '../../../components/externalLogin';

import CityDriver from '../../../public/assets/CityDriver.svg';
import TextField from '@/components/forms/TextField';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AnimatedLayout>
      <BackButton className="absolute left-2 top-2 bg-base-origin py-3 pr-2 shadow-xl" />
      <div className="flex flex-col -space-y-8 bg-background-turquoise">
        <CityDriver className="scale-110 place-self-center " />

        <div className="z-10 rounded-t-3xl bg-base-origin text-center">
          <p className=" py-5 text-3xl text-gray ">Iniciar sesión</p>
          <div className=" h-max rounded-t-xl bg-white py-5">
            <ExternalLogin />
            <form className="mt-5">
              <div className="mr-8 ml-8 flex flex-col ">
                <TextField
                  type={'text'}
                  content={email}
                  fieldName={'Correo electrónico'}
                  inputClassName="w-full"
                  parentClassName="mb-6"
                  setContent={setEmail}
                />
                <TextField
                  type={'password'}
                  content={password}
                  fieldName={'Contraseña'}
                  inputClassName="w-full"
                  parentClassName="mb-3"
                  setContent={setPassword}
                />
              </div>

              <div className="justify-between mr-8 ml-8 flex flex-row items-center py-3">
                <span className="flex flex-row items-center -justify-between space-x-7">
                  <Switch />
                  <p className="-translate-x-5 text-base font-bold text-light-gray">
                    {' '}
                    Recuérdame{' '}
                  </p>
                </span>
                <Link href="#">
                  <p className="text-base text-light-turquoise">
                    {' '}
                    ¿Has olvidado tu Contraseña?{' '}
                  </p>
                </Link>
              </div>

              <CTAButton text="Iniciar Sesión" className="mt-8 w-5/6" />

              <span className="flex flex-row justify-center -justify-between py-8">
                <p className="font-bold text-light-gray">
                  ¿No tienes una cuenta?
                </p>
                <Link href="#" className="translate-x-2">
                  <p className="text-dark-turquoise"> Regístrate </p>
                </Link>
              </span>
            </form>
          </div>
        </div>
      </div>
    </AnimatedLayout>
  );
}
