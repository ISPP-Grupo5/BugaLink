import AnimatedLayout from '../../../components/layouts/animated';
import { BackButtonText } from '../../../components/buttons/Back';
import Avatar from 'public/assets/avatar.svg';
import ProfileItems from '@/components/cards/profile';

export default function Profile() {
  return (
    <AnimatedLayout className="bg-white">
      <BackButtonText
        text="Mi perfil"
        className="bg-base-origin py-3 shadow-xl"
      />
      <div className="flex flex-col -space-y-8 bg-base-origin">
        <div className="z-10 rounded-t-3xl text-center">
          <Avatar className="mx-auto mt-6 h-20 w-20" />
          <p className="pt-5 text-3xl ">Pedro Pérez</p>
          <p className="text-sm text-gray ">Editar perfil</p>
          <div className="ml-4 w-11/12 py-4 text-light-gray">
            <hr></hr>
          </div>
          <div className="mb-6 flex justify-evenly">
            <div className="h-14 w-24 rounded-lg bg-white shadow-lg">
              <p className="text-xl font-bold">2 años</p>
              <p className="text-sm text-gray">Experiencia</p>
            </div>
            <div className="h-14 w-24 rounded-lg bg-white shadow-lg">
              <p className="text-xl font-bold">32</p>
              <p className="text-sm text-gray">Viajes</p>
            </div>
            <div className="h-14 w-24 rounded-lg bg-white shadow-lg">
              <p className="text-xl font-bold">4.2⭐</p>
              <p className="text-sm text-gray">Valoraciones</p>
            </div>
          </div>
          <div className="flex h-max items-start rounded-t-3xl bg-white py-5">
            <ProfileItems />
          </div>
        </div>
      </div>
    </AnimatedLayout>
  );
}
