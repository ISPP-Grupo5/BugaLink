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
        className="mr-2 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
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
        onClick={() => router.back()}
        className={'top-0 left-0 w-full text-left ' + className}
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
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span className="text-2xl">{text}</span>
      </button>
    </div>
  );
}

export default [BackButton, BackButtonText];
