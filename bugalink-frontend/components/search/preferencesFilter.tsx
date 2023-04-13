import CTAButton from '@/components/buttons/CTA';
import { Drawer } from '@mui/material';
import React, { useState } from 'react';
import { preferences } from '@/constants/preferences';
import PreferenceBox from '@/components/preferences/box';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function PreferencesFilter({ open, setOpen }: Props) {
  const [allowSmoke, setAllowSmoke] = useState(false);
  const [allowPets, setAllowPets] = useState(false);
  const [preferMusic, setPreferMusic] = useState(false);
  const [preferTalk, setPreferTalk] = useState(false);

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={() => setOpen(false)}
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
        <div className="ml-6 mt-2 mr-5">
          <p className="font-lato text-xl font-bold">Preferencias y normas</p>
          <p className="text-xs">
            En base a las preferencias y normas de los conductores
          </p>
          {/* TODO: This code is copypasted from the profile, make a component!! */}
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
        <div className="my-5 flex flex-col items-center">
          <CTAButton className="w-11/12" text={'FILTRAR'} />
        </div>
      </div>
    </Drawer>
  );
}
