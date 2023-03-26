import { useEffect, useState } from 'react';
import cn from 'classnames';

export default function UpcomingCardSkeleton({ className = '' }) {
  // For some reason, the content of the carousel isn't aligned until some miliseconds after the page loads.
  // We are hiding this with opacity: 0 and then setting it to 1 after a moment.
  const [firstLoad, setFirstLoad] = useState(true);
  const [opacityDone, setOpacityDone] = useState(false);

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
    }
  }, [firstLoad]);

  useEffect(() => {
    setTimeout(() => {
      setOpacityDone(true);
    }, 500);
  }, []);

  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl bg-light-gray transition-all duration-200',
        {
          'opacity-0': firstLoad,
          'opacity-100': !firstLoad,
          'animate-pulse': opacityDone,
        },
        className
      )}
    >
      <SkeletonHeader />
      <div className="flex w-full flex-col space-y-2 p-3">
        {[1, 2, 3].map((i) => (
          <span key={i} className="flex h-5 w-1/2 space-x-1">
            <div className="aspect-square h-full w-5 rounded-full bg-gray opacity-20" />
            <div className="h-full w-full rounded-xl bg-gray opacity-20" />
          </span>
        ))}
      </div>
    </div>
  );
}

const SkeletonHeader = () => (
  <div className="relative flex h-28 flex-none flex-col overflow-clip rounded-2xl bg-white">
    <span className="flex justify-end -space-x-7">
      <div className="h-9 w-2/5 rounded-bl-3xl rounded-tr-2xl bg-light-gray px-2.5 py-1" />
    </span>
    <span className="flex h-full items-center space-x-3 px-3">
      <div className="aspect-square w-14 rounded-full bg-light-gray" />
      <div className="flex w-full flex-col space-y-1">
        <div className="h-3 w-1/5 rounded-xl bg-light-gray" />
        <div className="h-3 w-1/4 rounded-xl bg-light-gray" />
        <div className="h-3 w-1/4 rounded-xl bg-light-gray" />
      </div>
    </span>
  </div>
);
