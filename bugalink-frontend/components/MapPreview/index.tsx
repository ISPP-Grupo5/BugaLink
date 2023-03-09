import Link from 'next/link';

export default function MapPreview({ className = '' }) {
  return (
    <Link href="/ride/V1StGXR8_Z5jdHi6B-myT/map">
      <div
        className={
          'flex flex-row items-center justify-between py-2 ' + className
        }
      >
        <img
          src="/assets/mocks/map.png"
          className="w-full h-48 object-cover rounded-lg"
        />
      </div>
    </Link>
  );
}
