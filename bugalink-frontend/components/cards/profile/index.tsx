import Edit from 'public/assets/edit.svg';
import Address from 'public/assets/address.svg';
import Settings from 'public/assets/settings.svg';
import Arrow from 'public/assets/arrow-right.svg';
import Wallet from 'public/assets/wallet.svg';

export default function ProfileItems() {
  return (
    <div className="w-11/12 divide-y divide-light-gray">
      <div className="flex items-center justify-center py-4">
        <Edit />
        <span className="-ml-12 w-52 font-lato">Editar perfil</span>
        <Arrow className="text-white" />
      </div>
      <div className="flex items-center justify-center py-4">
        <Address className="text-white" />
        <span className="-ml-12 w-52 font-lato">Direcciones</span>
        <Arrow className="text-white" />
      </div>
      <div className="flex items-center justify-center py-4">
        <Wallet className="text-white" />
        <span className="-ml-12 w-52 font-lato">Mi Monedero</span>
        <Arrow className="text-white" />
      </div>
      <div className="flex items-center justify-center py-4">
        <Settings />
        <span className="-ml-12 w-52 font-lato">Ajustes</span>
        <Arrow className="text-white" />
      </div>
    </div>
  );
}
