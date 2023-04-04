import { BackButton } from '@/components/buttons/Back';
import CTAButton from '@/components/buttons/CTA';
import ExternalLogin from '@/components/externalLogin';
import AnimatedLayout from '@/components/layouts/animated';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import TextField from '@/components/forms/TextField';
import { signIn, useSession } from 'next-auth/react';
import CityDriver from '/public/assets/CityDriver.svg';
import NEXT_ROUTES from '@/constants/nextRoutes';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const error = router.query.error;

  const { status } = useSession();
  useEffect(() => {
    if (status === 'authenticated') router.push(NEXT_ROUTES.HOME);
  }, [status]);

  const onSubmit = async (e) => {
    e.preventDefault();
    await signIn('credentials', {
      email,
      password,
      redirect: true,
      callbackUrl: '/',
    });
  };

  return (
    <AnimatedLayout className="bg-background-turquoise">
      <BackButton className="absolute left-2 top-2 bg-base-origin py-3 pr-2 shadow-xl" />
      <div className="flex h-full flex-col justify-end -space-y-10 bg-background-turquoise">
        <span className="flex w-full justify-center ">
          <CityDriver className="origin-bottom translate-y-4 scale-125" />
        </span>
        <div className="z-10 rounded-t-3xl bg-base-origin text-center">
          <p className=" py-5 text-3xl text-gray ">Iniciar sesión</p>
          <div className="rounded-t-xl bg-white pt-5 pb-16">
            <ExternalLogin />
            <p className="font-light text-gray opacity-70">
              o usa tu cuenta de correo
            </p>
            <form className="mt-5">
              <div className="mr-8 ml-8 flex flex-col space-y-5">
                <TextField
                  type="email"
                  content={email}
                  fieldName={'Correo electrónico'}
                  inputClassName="w-full"
                  setContent={setEmail}
                />
                <TextField
                  type="password"
                  content={password}
                  fieldName={'Contraseña'}
                  inputClassName="w-full"
                  setContent={setPassword}
                />
              </div>
              {error && <p className="mt-2 text-center text-red">{error}</p>}
              <CTAButton
                text="INICIAR SESIÓN"
                className="mt-4 w-5/6"
                onClick={onSubmit}
              />

              <span className="flex translate-y-7 -translate-x-2 flex-row justify-center -justify-between">
                <p className="font-light text-gray opacity-70">
                  ¿No tienes una cuenta?
                </p>
                <Link href={NEXT_ROUTES.SIGN_UP} className="translate-x-2">
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
