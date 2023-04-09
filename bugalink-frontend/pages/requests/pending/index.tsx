import { BackButtonText } from '@/components/buttons/Back';
import InformativeCard from '@/components/cards/informative';
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
      <div className="px-6">
        {isLoading || isError
          ? [1, 2, 3].map((i) => <RequestCardSkeleton key={i} />)
          : pendingRequests?.map((request: TripRequestI) => (
              <Link
                key={request.id}
                href={NEXT_ROUTES.ACCEPT_TRIP_REQUEST(request.id)}
              >
                <RequestCard
                  data-cy="request-accept"
                  key={request.id}
                  request={request}
                  className="mb-8"
                />
              </Link>
            ))}
        {pendingRequests && pendingRequests.length === 0 && (
          <InformativeCard>
            No tienes ninguna solictud pendiente
          </InformativeCard>
        )}
      </div>
    </AnimatedLayout>
  );
}
