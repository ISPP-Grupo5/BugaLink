import PreferenceBox from '@/components/preferences/box';
import NEXT_ROUTES from '@/constants/nextRoutes';
import { preferences } from '@/constants/preferences';
import { Drawer } from '@mui/material';
import { User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Address from 'public/assets/address.svg';
import ArrowHead from 'public/assets/arrow-head.svg';
import Carkey from 'public/assets/car-key.svg';
import Help from 'public/assets/help.svg';
import Logout from 'public/assets/log-out.svg';
import Preferences from 'public/assets/preferences.svg';
import Wallet from 'public/assets/wallet.svg';
import { useState } from 'react';

export default function ProfileItems() {
  const [drawerPreferences, setDrawerPreferences] = useState(false);
  const [allowSmoke, setAllowSmoke] = useState(false);
  const [allowPets, setAllowPets] = useState(false);
  const [preferMusic, setPreferMusic] = useState(false);
  const [preferTalk, setPreferTalk] = useState(false);

  const { data } = useSession();
  const user = data?.user as User;

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: NEXT_ROUTES.LOGIN,
    });
  };

  return (
    <div className="flex h-min w-full flex-col items-start justify-end rounded-t-3xl bg-white px-6 py-3 text-start text-xl">
      <Entry Icon={<Wallet />}>
        <Link href={NEXT_ROUTES.WALLET}>Mi cartera</Link>
      </Entry>
      <Entry onClick={() => setDrawerPreferences(true)} Icon={<Preferences />}>
        <span>Preferencias</span>
      </Entry>
      {!user?.is_validated_driver && (
        <Entry Icon={<Carkey className="h-10 w-10" />}>
          <Link href={NEXT_ROUTES.BECOME_DRIVER}>Hazte Conductor</Link>
        </Entry>
      )}
      <hr className="my-2 w-full text-light-gray" />
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
      className={'flex w-full items-center justify-between py-3 ' + className}
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
