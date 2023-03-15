import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BackButtonText } from '../../../../../components/buttons/Back';
import RequestCard from '../../../../../components/cards/request';
import AnimatedLayout from '../../../../../components/layouts/animated';
import NEXT_ROUTES from '../../../../../constants/nextRoutes';
import TripRequestI from '../../../../../interfaces/tripRequest';
import axios from '../../../../../utils/axios';

export default function PendingRequests() {
  const [pendingRequests, setPendingRequests] = useState<TripRequestI[]>([]);
  const userId = 1; // Hardcoded until we have sessions

  useEffect(() => {
    const getPendingRequests = async () => {
      const { data } = await axios.get(`/users/${userId}/trips?status=pending`);
      setPendingRequests(data);
    };

    getPendingRequests();
  }, []);

  return (
    <AnimatedLayout className="bg-white overflow-y-scroll">
      <BackButtonText text={'Solicitudes pendientes'} />
      <div className="mx-6 space-y-4">
        {pendingRequests.map((request: TripRequestI) => (
          <Link key={request.id} href={NEXT_ROUTES.ACCEPT_RIDE(request.id)}>
            <RequestCard key={request.id} request={request} className="mb-4" />
          </Link>
        ))}
      </div>
    </AnimatedLayout>
  );
}
