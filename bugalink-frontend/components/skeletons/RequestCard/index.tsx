import TripCardSkeleton from '@/components/skeletons/TripCard';

export default function RequestCardSkeleton() {
  return (
    <div className="flex w-full flex-col rounded-lg bg-white outline outline-1 outline-light-gray">
      <p className="mb-2 h-10 w-full rounded-t-lg bg-light-gray px-4 py-2 text-xl"></p>
      <TripCardSkeleton />
    </div>
  );
}
