import { useRouter } from 'next/router';
import cn from 'classnames';

type BackButtonProps = {
  className?: string;
};

export function BackButton({ className }: BackButtonProps) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className={cn('z-50 rounded-full', className)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mr-2 h-8 w-8"
        fill="none"
        viewBox="0 0 32 32"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M 16 2.59375 L 15.28125 3.28125 L 2.28125 16.28125 L 3.71875 17.71875 L 5 16.4375 L 5 28 L 14 28 L 14 18 L 18 18 L 18 28 L 27 28 L 27 16.4375 L 28.28125 17.71875 L 29.71875 16.28125 L 16.71875 3.28125 Z M 16 5.4375 L 25 14.4375 L 25 26 L 20 26 L 20 16 L 12 16 L 12 26 L 7 26 L 7 14.4375 Z"
        />
      </svg>
    </button>
  );
}

type BackButtonTextProps = {
  text: string;
  className?: string;
};

export function BackButtonText({
  text,
  className = 'bg-white', // White background if nothing else is specified
}: BackButtonTextProps) {
  const router = useRouter();
  return (
    <div
      className={
        'sticky top-0 z-50 flex w-full flex-row px-4 pt-5 pb-4 ' + className
      }
    >
      <button
        onClick={router.back}
        className={
          'top-0 left-0 flex w-full items-center text-left ' + className
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2 inline h-8 w-8"
          fill="none"
          viewBox="0 0 32 32"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M 16 2.59375 L 15.28125 3.28125 L 2.28125 16.28125 L 3.71875 17.71875 L 5 16.4375 L 5 28 L 14 28 L 14 18 L 18 18 L 18 28 L 27 28 L 27 16.4375 L 28.28125 17.71875 L 29.71875 16.28125 L 16.71875 3.28125 Z M 16 5.4375 L 25 14.4375 L 25 26 L 20 26 L 20 16 L 12 16 L 12 26 L 7 26 L 7 14.4375 Z"
          />
        </svg>
        <span className="text-2xl">{text}</span>
      </button>
    </div>
  );
}

export default [BackButton, BackButtonText];
