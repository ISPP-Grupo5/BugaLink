import NEXT_ROUTES from '@/constants/nextRoutes';
import useNumPendingRequests from '@/hooks/useNumPendingRequests';
import Solicitud from 'public/icons/Vista-Principal/solicitud.svg';
import SquareButton from '..';

export default function SquareRequestsButton({ disabled }) {
  const { numPendingRequests } = useNumPendingRequests();

  return (
    <SquareButton
      text="Solicitudes"
      link={NEXT_ROUTES.PENDING_REQUESTS}
      Icon={<Solicitud className="translate-x-0.5 translate-y-0.5" />}
      numNotifications={numPendingRequests || 0}
      disabled={disabled}
    />
  );
}
