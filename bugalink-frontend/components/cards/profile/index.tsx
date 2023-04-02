import NEXT_ROUTES from '@/constants/nextRoutes';
import { Drawer } from '@mui/material';
import Link from 'next/link';
import Address from 'public/assets/address.svg';
import ArrowHead from 'public/assets/arrow-head.svg';
import Carkey from 'public/assets/car-key.svg';
import Help from 'public/assets/help.svg';
import Logout from 'public/assets/log-out.svg';
import Preferences from 'public/assets/preferences.svg';
import PreferenceBox from '@/components/preferences/box';
import Wallet from 'public/assets/wallet.svg';
import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { User } from 'next-auth';

const preferences = {
  smoke: {
    checked: {
      icon: '🚬',
      text: 'Puedes fumar en mi coche',
    },
    unchecked: {
      icon: '🚭',
      text: 'Mi coche es libre de humos',
    },
  },
  music: {
    checked: {
      icon: '🔉',
      text: 'Conduzco con música',
    },
    unchecked: {
      icon: '🔇',
      text: 'Prefiero ir sin música',
    },
  },
  pets: {
    checked: {
      icon: '🐾',
      text: 'Puedes traer a tu mascota',
    },
    unchecked: {
      icon: '😿',
      text: 'No acepto mascotas',
    },
  },
  talk: {
    checked: {
      icon: '🗣️',
      text: 'Prefiero hablar durante el camino',
    },
    unchecked: {
      icon: '🤐',
      text: 'Prefiero no hablar durante el camino',
    },
  },
};

export default function ProfileItems() {
  const [drawerPreferences, setDrawerPreferences] = useState(false);
  const [allowSmoke, setAllowSmoke] = useState(false);
  const [allowPets, setAllowPets] = useState(false);
  const [preferMusic, setPreferMusic] = useState(false);
  const [preferTalk, setPreferTalk] = useState(false);

  const { data, status } = useSession();
  const user = data?.user as User;

  const router = useRouter();
  useEffect(() => {
    if (status === 'unauthenticated') router.push(NEXT_ROUTES.LOGIN);
  }, [status]);

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: NEXT_ROUTES.LOGIN,
    });
  };

  return (
    <div className="justify-between flex h-full w-full flex-col items-start gap-y-4 rounded-t-3xl bg-white px-6 py-8 text-start text-xl">
      <Entry Icon={<Address />}>
        <span>Direcciones</span>
      </Entry>
      <Entry Icon={<Wallet />}>
        <span>Mi cartera</span>
      </Entry>
      <Entry onClick={() => setDrawerPreferences(true)} Icon={<Preferences />}>
        <span>Preferencias</span>
      </Entry>
      <Entry Icon={<Carkey className="h-10 w-10" />}>
        <Link href={NEXT_ROUTES.CHECK_DRIVER(user?.user_id)}>
          Hazte Conductor
        </Link>
      </Entry>
      <hr className="w-full text-light-gray" />
      <Entry Icon={<Help />}>
        <a href="mailto:soporte@bugalink.es">Ayuda</a>
      </Entry>
      <Entry
        className="cursor-pointer"
        onClick={handleSignOut}
        Icon={<Logout />}
      >
        <span>Cerrar sesión</span>
      </Entry>

      <Drawer
        anchor="bottom"
        open={drawerPreferences}
        onClose={() => setDrawerPreferences(false)}
        SlideProps={{
          style: {
            minWidth: '320px',
            maxWidth: '480px',
            width: '100%',
            margin: '0 auto',
            backgroundColor: 'transparent',
          },
        }}
      >
        <div className="rounded-t-lg bg-white">
          <div className="mt-2 px-4">
            <p className="pt-2 text-3xl font-semibold">Mis preferencias</p>
            <div className="my-4 grid grid-cols-2 grid-rows-2 place-items-center gap-3">
              <PreferenceBox
                checked={allowSmoke}
                setChecked={setAllowSmoke}
                item={preferences.smoke}
              />
              <PreferenceBox
                checked={preferMusic}
                setChecked={setPreferMusic}
                item={preferences.music}
              />
              <PreferenceBox
                checked={allowPets}
                setChecked={setAllowPets}
                item={preferences.pets}
              />
              <PreferenceBox
                checked={preferTalk}
                setChecked={setPreferTalk}
                item={preferences.talk}
              />
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

function Entry({
  children,
  Icon,
  className = '',
  onClick = () => {
    return;
  },
}) {
  return (
    <div
      className={'justify-between flex w-full items-center ' + className}
      onClick={onClick}
    >
      <span className="flex items-center gap-x-2">
        <span className="text-white">{Icon}</span>
        {children}
      </span>
      <ArrowHead className="text-gray" />
    </div>
  );
}
