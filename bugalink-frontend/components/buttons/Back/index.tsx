import Link from 'next/link';

export function BackButton() {
  return (
    <Link
      href="/#/"
      className="fixed top-2 left-2 pl-3 pr-2 py-3 rounded-full shadow-xl bg-base"
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
    </Link>
  );
}

export function BackButtonText({ text }) {
  return (
    <Link
      href="/#/"
      className="pl-3 pr-3 py-3 fixed top-0 left-2 bg-white w-full"
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
    </Link>
  );
}

export default [BackButton, BackButtonText];
