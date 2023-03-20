import Address from 'public/assets/address.svg';
import Preferences from 'public/assets/preferences.svg';
import Help from 'public/assets/help.svg';
import Wallet from 'public/assets/wallet.svg';
import Logout from 'public/assets/log-out.svg';
import React, { useState } from 'react';
import { Drawer } from '@mui/material';
import ArrowHead from 'public/assets/arrow-head.svg';

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

  return (
    <div className="flex h-full w-full flex-col items-start justify-between gap-y-4 rounded-t-3xl bg-white px-6 py-8 text-start text-xl">
      <Entry Icon={<Address />}>
        <span>Direcciones</span>
      </Entry>
      <Entry Icon={<Wallet />}>
        <span>Mi cartera</span>
      </Entry>
      <Entry onClick={() => setDrawerPreferences(true)} Icon={<Preferences />}>
        <span>Preferencias</span>
      </Entry>
      <hr className="w-full text-light-gray" />
      <Entry Icon={<Help />}>
        <a href="mailto:soporte@bugalink.es">Ayuda</a>
      </Entry>
      <Entry Icon={<Logout />}>
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
  onClick = () => {
    return;
  },
}) {
  return (
    <div className="flex w-full items-center justify-between" onClick={onClick}>
      <span className="flex items-center gap-x-2">
        <span className="text-white">{Icon}</span>
        {children}
      </span>
      <ArrowHead className="text-gray" />
    </div>
  );
}

function PreferenceBox({ checked, setChecked, item }) {
  return (
    <div
      className={
        'grid min-h-full grid-rows-2 flex-col place-items-center rounded-lg border border-light-gray p-1 transition-colors duration-200 ' +
        (checked ? 'bg-white' : 'bg-light-gray')
      }
      onClick={() => {
        setChecked(!checked);
      }}
    >
      <p className="text-3xl">{item[checked ? 'checked' : 'unchecked'].icon}</p>
      <p className="text-center leading-5">
        {item[checked ? 'checked' : 'unchecked'].text}
      </p>
    </div>
  );
}
