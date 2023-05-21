import CTAButton from '@/components/buttons/CTA';
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
      const { data } = error.response;
      if (data.email) {
        if (
          data.email[0] ===
          'A user is already registered with this e-mail address.'
        ) {
          data.email[0] = 'Ya existe un usuario con este correo electrónico';
        } else if (data.email[0] === 'Enter a valid email address.') {
          data.email[0] = 'Ingrese una dirección de correo electrónico válida';
        } else if (data.email[0] === 'This field may not be blank.') {
          data.email[0] = 'Este campo no puede estar vacío.';
        }
      }
      if (data.password1) {
        const passwordErrors = [];
        if (password.length > 20) {
          passwordErrors.push(
            'La contraseña no puede tener más de 20 caracteres. '
          );
        }
        if (
          !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(
            password
          )
        ) {
          passwordErrors.push(
            'La contraseña debe tener al menos una mayúscula, una minúscula, un número y un caracter especial. '
          );
        }
        if (data.password1.includes('This password is too common.')) {
          passwordErrors.push('La contraseña es demasiado común. ');
        }
        if (data.password1.includes('This password is entirely numeric.')) {
          passwordErrors.push('La contraseña es completamente numérica. ');
        }
        if (
          data.password1.includes(
            'This password is too short. It must contain at least 8 characters.'
          )
        ) {
          passwordErrors.push(
            'La contraseña es demasiado corta. Debe contener al menos 8 caracteres. '
          );
        }
        if (data.password1.includes('This field may not be blank.')) {
          passwordErrors.push('Este campo no puede estar vacío. ');
        }
        data.password1 = passwordErrors;
      } else {
        const passwordErrors = [];
        if (password.length > 20) {
          passwordErrors.push(
            'La contraseña no puede tener más de 20 caracteres. '
          );
        }
        if (
          !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(
            password
          )
        ) {
          passwordErrors.push(
            'La contraseña debe tener al menos una mayúscula, una minúscula, un número y un caracter especial. '
          );
        }
        if (passwordErrors.length > 0) {
          data.password1 = passwordErrors;
        }
      }
      if (data.first_name) {
        if (data.first_name[0] === 'This field may not be blank.') {
          data.first_name[0] = 'Este campo no puede estar vacío.';
        }
      }
      if (data.last_name) {
        if (data.last_name[0] === 'This field may not be blank.') {
          data.last_name[0] = 'Este campo no puede estar vacío.';
        }
      }
      delete data.password2;
      setErrors(data);
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
    <AnimatedLayout>
      <div className="flex h-full flex-col justify-end -space-y-10">
        <span className="flex w-full justify-center overflow-x-clip">
          <RegisterImg className="origin-bottom scale-110 bg-light-gray" />
        </span>
        <div className="z-10 rounded-t-3xl bg-base-origin text-center">
          <p className=" py-5 text-3xl text-gray ">Crear cuenta nueva</p>
          <div className="rounded-t-xl bg-white py-5">
            <form className="mt-5">
              <div className="mr-8 ml-8 flex flex-col space-y-5">
                <TextField
                  type={'text'}
                  content={email}
                  fieldName={'Correo electrónico'}
                  inputClassName="w-full"
                  parentClassName=""
                  setContent={setEmail}
                  name="email"
                  error={errors && errors['email']}
                />
                <span className="flex space-x-2">
                  <TextField
                    type={'text'}
                    content={name}
                    fieldName={'Nombre'}
                    inputClassName="w-full"
                    parentClassName=""
                    setContent={setName}
                    name="name"
                    error={errors && errors['first_name']}
                  />
                  <TextField
                    type={'text'}
                    content={surname}
                    fieldName={'Apellidos'}
                    inputClassName="w-full"
                    parentClassName=""
                    setContent={setSurname}
                    name="surname"
                    error={errors && errors['last_name']}
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
                  name="password"
                  error={errors && errors['password1']}
                />
              </div>
              <CTAButton
                text={isLoading ? 'PROCESANDO...' : 'REGISTRARSE'}
                className="mt-2 w-5/6"
                onClick={handleRegister}
                disabled={isLoading}
              />
              <span className="flex flex-col items-center pt-2">
                <p className="font-light text-gray">
                  ¿Ya tienes una cuenta?{' '}
                  <Link
                    href={NEXT_ROUTES.LOGIN}
                    className="font-normal text-dark-turquoise"
                  >
                    Iniciar sesión
                  </Link>
                </p>
                <p className="pt-2 text-sm font-light text-gray">
                  Al registrarte aceptas nuestros{' '}
                  <a
                    href="https://www.bugalink.es/terms"
                    className="font-normal text-dark-turquoise"
                  >
                    Términos y condiciones
                  </a>
                </p>
              </span>
            </form>
          </div>
        </div>
      </div>
    </AnimatedLayout>
  );
}
