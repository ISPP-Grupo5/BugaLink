import { useRouter } from 'next/router';

type BackButtonProps = {
  className?: string;
};

export function BackButton({ className = '' }: BackButtonProps) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className={'pl-3 rounded-full z-50 ' + className}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 mr-2"
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

export function BackButtonText({ text, className }: BackButtonTextProps) {
  const router = useRouter();
  return (
    <div className="flex flex-row bg-transparent w-full mb-14 z-50">
      <button
        onClick={() => router.back()}
        className={`absolute pl-3 pr-3 py-3 top-0 left-0 text-left w-full bg-white ${className}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 mr-2 inline"
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
        <span className="font-semibold text-2xl">{text}</span>
      </button>
    </div>
  );
}

export default [BackButton, BackButtonText];
