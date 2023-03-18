import AnimatedLayout from '../../../components/layouts/animated';
import { BackButton } from '../../../components/buttons/Back';
import Avatar from 'public/assets/avatar.svg';
import ProfileItems from '@/components/cards/profile';

export default function Profile() {
  return (
    <AnimatedLayout className="bg-white">
      <BackButton className="absolute left-2 top-2 bg-base-origin py-3 pr-2 shadow-xl" />
      <div className="bg-background-turquoise flex flex-col -space-y-8">
        <div className="z-10 rounded-t-3xl bg-base-origin text-center">
          <div className="h-32 bg-base-origin"></div>
          <div className="flex h-max flex-col items-center rounded-t-3xl bg-white py-5">
            <Avatar className="z-10 -mt-16 h-20 w-20" />
            <p className="py-5 text-3xl text-gray ">Pedro Pérez</p>
            <ProfileItems />
            <p className="fixed bottom-0 mb-5 mr-5 font-lato text-sm text-light-red">
              Log out
            </p>
          </div>
        </div>
      </div>
    </AnimatedLayout>
  );
}
