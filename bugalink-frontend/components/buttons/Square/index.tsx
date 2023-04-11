import Link from 'next/link';
import cn from 'classnames';

type Params = {
  text: string;
  link: string;
  Icon: any;
  disabled?: boolean;
  numNotifications?: number;
};

export default function SquareButton({
  text,
  Icon,
  link,
  disabled = false,
  numNotifications = 0,
}: Params) {
  return (
    <button disabled={disabled} className="relative w-full">
      <Link
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
          }
        }}
        href={link}
        className={cn(
          {
            'cursor-auto grayscale': disabled,
          },
          'flex justify-end overflow-hidden rounded-lg bg-white'
        )}
      >
        {Icon}
      </Link>
      <p className="text-center text-lg">{text}</p>
      {numNotifications > 0 && (
        <p className="absolute -left-3 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-light-red text-center text-lg font-semibold text-white">
          {numNotifications}
        </p>
      )}
    </button>
  );
}
