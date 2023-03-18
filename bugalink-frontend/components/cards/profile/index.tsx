import Edit from 'public/assets/edit.svg';
import Address from 'public/assets/address.svg';
import Settings from 'public/assets/settings.svg';
import Arrow from 'public/assets/arrow-right.svg';

export default function ProfileItems() {
  return (
    <div className="divide-light-gray divide-y w-11/12">
      <div className="flex items-center justify-center py-4">
        <Edit />
        <span className="-ml-12 w-52 font-lato">Editar perfil</span>
        <Arrow />
      </div>
      <div className="flex items-center justify-center py-4">
        <Address className="bg-white" />
        <span className="-ml-12 w-52 font-lato">Direcciones</span>
        <Arrow />
      </div>
      <div className="flex items-center justify-center py-4">
        <Settings />
        <span className="-ml-12 w-52 font-lato">Ajustes</span>
        <Arrow />
      </div>
    </div>
  );
}
