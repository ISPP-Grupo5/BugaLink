import { useRouter } from 'next/router';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="fixed top-2 left-2 pl-3 pr-2 py-3 rounded-full shadow-xl bg-base z-50"
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
