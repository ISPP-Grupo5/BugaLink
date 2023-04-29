import AnimatedLayout from '@/components/layouts/animated';
import Check from '/public/assets/check.svg';
import Cross from '/public/icons/Cross.svg';
import Link from 'next/link';
import NEXT_ROUTES from '@/constants/nextRoutes';
export default function ConfirmationScreen({ title = '', description = '' }) {
  return (
    <AnimatedLayout className="bg-white">
      <Link href={NEXT_ROUTES.HOME} className="absolute top-4 right-4">
        <Cross className="h-12 w-12" />
      </Link>

      <div className="flex h-full flex-col items-center justify-center text-center">
        <span className="aspect-square rounded-full bg-green p-8 outline outline-8 outline-white">
          <Check className="h-16 w-16 place-self-center text-white" />
        </span>
        <h1 className="mt-8 text-xl font-bold">{title}</h1>
        <p className="text-gray">{description}</p>
      </div>
    </AnimatedLayout>
  );
}
