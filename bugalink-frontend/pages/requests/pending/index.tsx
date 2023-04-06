import { BackButtonText } from '@/components/buttons/Back';
import RequestCard from '@/components/cards/request';
import AnimatedLayout from '@/components/layouts/animated';
import RequestCardSkeleton from '@/components/skeletons/RequestCard';
import NEXT_ROUTES from '@/constants/nextRoutes';
import usePendingRequests from '@/hooks/usePendingRequests';
import TripRequestI from '@/interfaces/tripRequest';
import Link from 'next/link';

export default function PendingRequests() {
  const { pendingRequests, isLoading, isError } = usePendingRequests();

  return (
    <AnimatedLayout className="overflow-y-scroll bg-white">
      <BackButtonText text={'Solicitudes pendientes'} />
      <div className="mx-6 space-y-4">
        {isLoading || isError
          ? [1, 2, 3].map((i) => <RequestCardSkeleton key={i} />)
          : pendingRequests?.map((request: TripRequestI) => (
              <Link key={request.id} href={NEXT_ROUTES.ACCEPT_RIDE(request.id)}>
                <RequestCard
                  data-cy="request-accept"
                  key={request.id}
                  request={request}
                  className="mb-4"
                />
              </Link>
            ))}
        {pendingRequests && pendingRequests.length === 0 && (
          <div className="mx-4 mt-4 rounded-md border border-border-color py-5 text-center text-xl font-light text-gray md:mx-5">
            No tienes ninguna solictud pendiente.
          </div>  
        )}
      </div>
    </AnimatedLayout>
  );
}
