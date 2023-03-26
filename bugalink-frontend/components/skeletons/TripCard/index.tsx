import AvatarSkeleton from '../Avatar';

export default function TripCardSkeleton({ className = '' }) {
  return (
    <div
      className={
        'grid w-full grid-cols-2 grid-rows-4 gap-y-2 gap-x-4 p-4 pt-1 ' +
        className
      }
    >
      <span className="col-span-2 row-span-2 flex items-center space-x-4">
        <AvatarSkeleton className="h-12 bg-light-gray" />
        <div className="flex w-full flex-col space-y-1">
          <div className="h-4 w-1/6 rounded-full bg-light-gray" />
          <div className="h-4 w-1/5 rounded-full bg-light-gray" />
        </div>
      </span>
      {[1, 2, 3, 4].map((i) => (
        <span key={i} className="flex h-8 w-full flex-col space-y-1">
          <div className="h-3 w-1/4 rounded-xl bg-light-gray" />
          <div className="h-3 w-2/3 rounded-xl bg-light-gray" />
        </span>
      ))}
    </div>
  );
}
