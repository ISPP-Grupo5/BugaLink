import { useRouter } from 'next/router';

type Params = {
  text: string;
  className?: string;
};

export default function BackButtonWithHeader({ text, className }: Params) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className={`pl-3 pr-3 py-3 fixed top-0 left-0 rounded-b-xl w-full shadow-lg bg-white ${className}`}
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
  );
}
