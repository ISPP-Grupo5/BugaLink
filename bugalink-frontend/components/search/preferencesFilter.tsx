import CTAButton from '@/components/buttons/CTA';
import { Drawer } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { preferences } from '@/constants/preferences';
import PreferenceBox from '@/components/preferences/box';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  allowsSmoking: boolean | string;
  allowsPets: boolean | string;
  prefersTalk: boolean | string;
  prefersMusic: boolean | string;
  setAllowsPets: (allowsPets: string) => void;
  setAllowsSmoking: (allowsSmoking: string) => void;
  setPrefersMusic: (prefersMusic: string) => void;
  setPrefersTalk: (prefersTalk: string) => void;
  handleSearch;
};

export default function PreferencesFilter({
  open,
  setOpen,
  allowsPets,
  allowsSmoking,
  prefersMusic,
  prefersTalk,
  setAllowsPets,
  setAllowsSmoking,
  setPrefersMusic,
  setPrefersTalk,
  handleSearch,
}: Props) {
  const [allowSmoke, setAllowSmoke] = useState(allowsSmoking === 'True');
  const [allowPets, setAllowPets] = useState(allowsPets === 'True');
  const [preferMusic, setPreferMusic] = useState(prefersMusic === 'True');
  const [preferTalk, setPreferTalk] = useState(prefersTalk === 'True');

  useEffect(() => {
    if (allowSmoke) {
      setAllowsSmoking('True');
    } else {
      setAllowsSmoking('');
    }

    if (allowPets) {
      setAllowsPets('True');
    } else {
      setAllowsPets('');
    }

    if (preferMusic) {
      setPrefersMusic('True');
    } else {
      setPrefersMusic('');
    }

    if (preferTalk) {
      setPrefersTalk('True');
    } else {
      setPrefersTalk('');
    }
  }, [allowSmoke, allowPets, preferMusic, preferTalk]);

  allowsSmoking = allowsSmoking === 'True';
  allowsPets = allowsPets === 'True';
  prefersMusic = prefersMusic === 'True';
  prefersTalk = prefersTalk === 'True';

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
          <CTAButton className="w-11/12" text={'FILTRAR'} onClick={handleSearch}/>
        </div>
      </div>
    </Drawer>
  );
}
