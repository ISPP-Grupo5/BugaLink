import NEXT_ROUTES from '@/constants/nextRoutes';
import SquareButton from '..';
import Calendar from '/public/icons/Vista-Principal/calendar.svg';

interface Props {
  userId: number;
}

export default function SquareRoutinesButton({ userId }: Props) {
  return (
    <SquareButton
      text="Mi horario"
      link={NEXT_ROUTES.MY_ROUTINES(userId)}
      Icon={<Calendar />}
    />
  );
}
