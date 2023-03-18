import NEXT_ROUTES from '@/constants/nextRoutes';
import SquareButton from '..';
import Calendar from '/public/icons/Vista-Principal/calendar.svg';

export default function SquareRoutinesButton() {
  const USER_ID = 1; // TODO: remove this hardcoded value
  return (
    <SquareButton
      text="Horarios"
      link={NEXT_ROUTES.MY_ROUTINES(USER_ID)}
      Icon={<Calendar />}
    />
  );
}
