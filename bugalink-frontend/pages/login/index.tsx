import { BackButton } from '@/components/buttons/Back';
import CTAButton from '@/components/buttons/CTA';
import ExternalLogin from '@/components/externalLogin';
import TextField from '@/components/forms/TextField';
import AnimatedLayout from '@/components/layouts/animated';
import NEXT_ROUTES from '@/constants/nextRoutes';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import CityDriver from '/public/assets/CityDriver.svg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const error = router.query.error;

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn('credentials', {
        email,
        password,
        redirect: true,
        callbackUrl: '/',
      });
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedLayout className="bg-background-turquoise">
      <div className="flex h-full flex-col justify-end -space-y-10 bg-background-turquoise">
        <span className="flex w-full justify-center overflow-x-clip">
          <CityDriver className="origin-bottom translate-y-4 scale-125" />
        </span>
        <div className="z-10 rounded-t-3xl bg-base-origin text-center">
          <p className=" py-5 text-3xl text-gray ">Iniciar sesión</p>
          <div className="rounded-t-xl bg-white py-5">
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
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
              </div>
              {error && <p className="mt-2 text-center text-red">{error}</p>}
              <CTAButton
                text={isLoading ? 'PROCESANDO...' : 'INICIAR SESIÓN'}
                className="mt-4 w-5/6"
                onClick={onSubmit}
                disabled={isLoading}
              />

              <span className="flex flex-row justify-center -justify-between pt-4">
                <p className="font-light text-gray opacity-70">
                  ¿No tienes una cuenta?
                </p>
                <Link href={NEXT_ROUTES.SIGN_UP} className="ml-1">
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
