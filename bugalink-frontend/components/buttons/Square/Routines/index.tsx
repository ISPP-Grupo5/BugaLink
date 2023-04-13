import NEXT_ROUTES from '@/constants/nextRoutes';
import SquareButton from '..';
import Calendar from '/public/icons/Vista-Principal/calendar.svg';

export default function SquareRoutinesButton() {
  return (
    <SquareButton
      text="Mi horario"
      link={NEXT_ROUTES.MY_ROUTINES}
      Icon={<Calendar />}
    />
  );
}
