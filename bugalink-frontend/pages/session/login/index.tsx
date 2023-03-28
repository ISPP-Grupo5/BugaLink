import AnimatedLayout from '@/components/layouts/animated';
import { BackButton } from '@/components/buttons/Back';
import CTAButton from '@/components/buttons/CTA';
import Link from 'next/link';
import { useRef, useState } from 'react';
import Switch from '@/components/forms/Switch';
import ExternalLogin from '@/components/externalLogin';

import CityDriver from '/public/assets/CityDriver.svg';
import TextField from '@/components/forms/TextField';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/router';

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
  const { login } = useAuth();
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});

  const formRef = useRef<HTMLFormElement>(null);

  const validateForm = (values: FormValues) => {
    const errors: FormErrors = {};

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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const values: FormValues = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      };
      const errors = validateForm(values);
      setErrors(errors);
      if (Object.keys(errors).length === 0) {
        const { status, data } = await login(email, password);
        if (status === 200) router.push('/');
        else console.log(data);
      }
    }
  };

  return (
    <AnimatedLayout className="bg-white">
      <BackButton className="absolute left-2 top-2 bg-base-origin py-3 pr-2 shadow-xl" />
      <div className="flex flex-col -space-y-10 ">
        <span className="flex w-full justify-center bg-background-turquoise">
          <CityDriver />
        </span>

        <div className="z-10 rounded-t-3xl bg-base-origin text-center">
          <p className=" py-5 text-3xl text-gray ">Iniciar sesión</p>
          <div className="rounded-t-xl bg-white py-5">
            <ExternalLogin />
            <p className="font-bold text-light-gray">
              o usa tu cuenta de correo
            </p>
            <form ref={formRef} className="mt-5">
              <div className="mr-8 ml-8 flex flex-col space-y-5">
                <TextField
                  name="email"
                  type="email"
                  content={email}
                  fieldName={'Correo electrónico'}
                  inputClassName="w-full"
                  parentClassName="w-full flex flex-col items-center"
                  setContent={setEmail}
                  error={errors.email}
                />
                <TextField
                  name="password"
                  type="password"
                  content={password}
                  fieldName={'Contraseña'}
                  inputClassName="w-full"
                  parentClassName="w-full flex flex-col items-center"
                  setContent={setPassword}
                  error={errors.password}
                />
              </div>

              <div className="mr-8 ml-8 flex flex-row items-center justify-between py-3">
                <span className="-justify-between flex flex-row items-center space-x-7">
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

              <CTAButton
                text="INICIAR SESIÓN"
                className="mt-4 w-5/6"
                onClick={handleLogin}
              />

              <span className="-justify-between flex translate-y-7 -translate-x-2 flex-row justify-center">
                <p className="font-bold text-light-gray">
                  ¿No tienes una cuenta?
                </p>
                <Link href="/session/register" className="translate-x-2">
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
