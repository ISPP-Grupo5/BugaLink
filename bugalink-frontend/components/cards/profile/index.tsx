import Address from 'public/assets/address.svg';
import Preferences from 'public/assets/preferences.svg';
import Help from 'public/assets/help.svg';
import Wallet from 'public/assets/wallet.svg';
import Logout from 'public/assets/log-out.svg';
import React, { useState } from 'react';
import { Drawer } from '@mui/material';

export default function ProfileItems() {
  const [drawerPreferences, setDrawerPreferences] = useState(false);
  return (
    <div className="mx-auto flex w-11/12 flex-col items-center py-4 text-start">
      <div className="flex items-center gap-x-2 py-4">
        <Address className="text-white" />
        <span className="w-52 font-lato">Direcciones</span>
      </div>
      <div className="flex items-center gap-x-2 py-4">
        <Wallet className="text-white" />
        <span className="w-52 font-lato">Mi cartera</span>
      </div>
      <div
        className="flex items-center gap-x-2 py-4"
        onClick={() => setDrawerPreferences(true)}
      >
        <Preferences />
        <span className="w-52 font-lato">Preferencias</span>
      </div>
      <div className="w-11/12 py-4 text-light-gray">
        <hr></hr>
      </div>
      <div className="flex items-center gap-x-2 py-4">
        <Help />
        <a href="mailto:soporte@bugalink.es" className=" w-52 font-lato">
          <span>Ayuda</span>
        </a>
      </div>
      <div className="flex items-center gap-x-2 py-4">
        <Logout />
        <span className="w-52 font-lato">Cerrar sesión</span>
      </div>

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
          <div className="ml-6 mt-2">
            <p className="font-lato text-2xl font-bold">Mis preferencias</p>
            <div className="my-6 grid grid-cols-2 grid-rows-2 gap-y-3">
              <div className="flex h-20 w-40 flex-col items-center rounded-lg border border-light-gray bg-white">
                <p className="text-xl font-bold">🗣️</p>
                <p className="text-center font-bold">
                  Prefiero hablar durante el camino
                </p>
              </div>
              <div className="flex h-20 w-40 flex-col items-center rounded-lg border border-light-gray bg-white">
                <p className="text-xl font-bold">🔉</p>
                <p className="text-center font-bold">
                  Prefiero ir escuchando música
                </p>
              </div>
              <div className="flex h-20 w-40 flex-col items-center rounded-lg border border-light-gray bg-light-gray">
                <p className="text-xl font-bold">🚭</p>
                <p className="text-center font-bold">
                  Mi coche es libre de humos
                </p>
              </div>
              <div className="flex h-20 w-40 flex-col items-center rounded-lg border border-light-gray bg-light-gray">
                <p className="text-xl font-bold">😿</p>
                <p className="text-center font-bold">
                  No acepto pasajeros con mascotas
                </p>
              </div>
            </div>
          </div>
          <div className="my-5 flex flex-col items-center"></div>
        </div>
      </Drawer>
    </div>
  );
}
