export default function RoutineCardSkeleton() {
  return (
    <span className="flex h-[5.7rem] w-full animate-pulse rounded-lg border border-border-color">
      <div className="min-h-full w-2.5 rounded-l-lg bg-gray" />
      <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-2.5 p-2">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className="flex w-full flex-col space-y-1">
            <div className="h-2.5 w-1/4 rounded-xl bg-light-gray" />
            <div className="h-3 w-2/3 rounded-xl bg-light-gray" />
          </span>
        ))}
      </div>
    </span>
  );
}
