import { BackButtonText } from '@/components/buttons/Back';
import RequestCard from '@/components/cards/request';
import AnimatedLayout from '@/components/layouts/animated';
import NEXT_ROUTES from '@/constants/nextRoutes';
import usePendingRequests from '@/hooks/usePendingRequests';
import TripRequestI from '@/interfaces/tripRequest';
import Link from 'next/link';

export default function PendingRequests() {
  const { pendingRequests, isLoading, isError } = usePendingRequests();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  return (
    <AnimatedLayout className="overflow-y-scroll bg-white">
      <BackButtonText text={'Solicitudes pendientes'} />
      <div className="mx-6 space-y-4">
        {pendingRequests.map((request: TripRequestI) => (
          <Link
            data-cy="request-accept"
            key={request.id}
            href={NEXT_ROUTES.ACCEPT_RIDE(request.id)}
          >
            <RequestCard key={request.id} request={request} className="mb-4" />
          </Link>
        ))}
      </div>
    </AnimatedLayout>
  );
}
