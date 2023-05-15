import CTAButton from '@/components/buttons/CTA';
import TextField from '@/components/forms/TextField';
import AnimatedLayout from '@/components/layouts/animated';
import NEXT_ROUTES from '@/constants/nextRoutes';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, MouseEvent, useRef } from 'react';
import CityDriver from '/public/assets/CityDriver.svg';

interface FormErrors {
  email?: string;
  password?: string;
}

interface FormValues {
  email: string;
  password: string;
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  let error = router.query.error;

  if (error === 'No active account found with the given credentials') {
    error = 'No se encontró una cuenta activa con las credenciales dadas';
  }

  const onSubmit = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    setIsLoading(true);

    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const values: FormValues = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      };

      const errors: FormErrors = {};
      const emailRegex = /^\S+@\S+$/i;
      if (!email) {
        errors.email = 'Por favor, ingrese su correo electrónico';
      } else if (!emailRegex.test(email)) {
        errors.email = 'Por favor, ingrese un correo electrónico válido';
      }

      if (!password) {
        errors.password = 'Por favor, ingrese una contraseña';
      }

      setErrors(errors);

      if (Object.keys(errors).length === 0) {
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
      } else {
        setIsLoading(false);
      }
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
            <form className="mt-5" ref={formRef}>
              <div className="mr-8 ml-8 flex flex-col space-y-5">
                <TextField
                  type="email"
                  content={email}
                  fieldName={'Correo electrónico'}
                  inputClassName="w-full"
                  setContent={setEmail}
                  error={errors.email}
                />
                <TextField
                  type="password"
                  content={password}
                  fieldName={'Contraseña'}
                  inputClassName="w-full"
                  setContent={setPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  error={errors.password}
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
