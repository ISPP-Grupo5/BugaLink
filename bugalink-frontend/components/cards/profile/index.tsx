import PreferenceBox from '@/components/preferences/box';
import NEXT_ROUTES from '@/constants/nextRoutes';
import { preferences as preferencesData } from '@/constants/preferences';
import { Drawer } from '@mui/material';
import { axiosAuth } from '@/lib/axios';
import { User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import ArrowHead from 'public/assets/arrow-head.svg';
import Carkey from 'public/assets/car-key.svg';
import Help from 'public/assets/help.svg';
import Logout from 'public/assets/log-out.svg';
import Preferences from 'public/assets/preferences.svg';
import Wallet from 'public/assets/wallet.svg';
import { useEffect, useState } from 'react';
import useDriverPreferences from '@/hooks/useDriverPreferences';

export default function ProfileItems() {
  const { data } = useSession();
  const user = data?.user as User;
  const [drawerPreferences, setDrawerPreferences] = useState(false);
  const { preferences, isLoadingPreferences } = useDriverPreferences(
    user.driver_id
  );
  const [allowSmoke, setAllowSmoke] = useState(
    preferences ? preferences.allows_smoke : false
  );
  const [allowPets, setAllowPets] = useState(
    preferences ? preferences.allows_pets : false
  );
  const [preferMusic, setPreferMusic] = useState(
    preferences ? preferences.prefers_music : false
  );
  const [preferTalk, setPreferTalk] = useState(
    preferences ? preferences.prefers_talk : false
  );

  useEffect(() => {
    if (preferences) {
      setAllowPets(preferences.allows_pets);
      setAllowSmoke(preferences.allows_smoke);
      setPreferMusic(preferences.prefers_music);
      setPreferTalk(preferences.prefers_talk);
    }
  }, [preferences, isLoadingPreferences]);

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: NEXT_ROUTES.LOGIN,
    });
  };

  function onClosePreferences() {
    const body = {
      prefers_talk: preferTalk,
      prefers_music: preferMusic,
      allows_pets: allowPets,
      allows_smoke: allowSmoke,
    };

    setDrawerPreferences(false);
    axiosAuth
      .put('/drivers/' + user.driver_id + '/preferences', body)
      .then((response) => {
        console.log('Preferencias actualizadas:', response.data);
      })
      .catch((error) => {
        console.error('Error actualizando las preferencias: ', error);
      });
  }

  return (
    <div className="flex h-min w-full flex-col items-start justify-end rounded-t-3xl bg-white px-6 py-3 text-start text-xl">
      <Entry Icon={<Wallet />}>
        <Link href={NEXT_ROUTES.WALLET}>Mi cartera</Link>
      </Entry>
      {user?.is_validated_driver && (
        <Entry
          onClick={() => setDrawerPreferences(true)}
          Icon={<Preferences />}
          className="cursor-pointer"
        >
          <span>Preferencias y normas</span>
        </Entry>
      )}
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
        onClose={() => onClosePreferences()}
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
                item={preferencesData.smoke}
              />
              <PreferenceBox
                checked={preferMusic}
                setChecked={setPreferMusic}
                item={preferencesData.music}
              />
              <PreferenceBox
                checked={allowPets}
                setChecked={setAllowPets}
                item={preferencesData.pets}
              />
              <PreferenceBox
                checked={preferTalk}
                setChecked={setPreferTalk}
                item={preferencesData.talk}
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
