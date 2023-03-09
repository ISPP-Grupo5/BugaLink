import Link from 'next/link';

export default function MapPreview() {
  return (
    <Link href="/ride/V1StGXR8_Z5jdHi6B-myT/map">
      <div className="flex flex-row items-center justify-between px-5 py-2">
        <img
          src="/assets/mocks/map.png"
          className="w-full h-48 object-cover rounded-lg"
        />
      </div>
    </Link>
  );
}
