export default function AvatarSkeleton({ className = 'bg-light-gray' }) {
  return (
    <div
      className={'aspect-square h-14 animate-pulse rounded-full ' + className}
    />
  );
}
