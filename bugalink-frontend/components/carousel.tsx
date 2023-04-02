import useUpcomingTrips from '@/hooks/useUpcomingTrips';
import TripRequestI from '@/interfaces/tripRequest';
import cn from 'classnames';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import UpcomingCard from './cards/upcoming';
import UpcomingCardSkeleton from './skeletons/Upcoming';

const TWEEN_FACTOR = 0.3;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

// https://codesandbox.io/s/oge8ll
export default function UpcomingTripsCarousel(props) {
  const { options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [tweenValues, setTweenValues] = useState<number[]>([1, 0.85, 0]);
  const { upcomingTrips, isLoading, isError } = useUpcomingTrips();

  const onScroll = useCallback(() => {
    if (!emblaApi) return;

    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();

    const styles = emblaApi.scrollSnapList().map((scrollSnap, index) => {
      if (!emblaApi.slidesInView().includes(index)) return 0;
      let diffToTarget = scrollSnap - scrollProgress;

      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.target().get();
          if (index === loopItem.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
            if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
          }
        });
      }
      const tweenValue = 1 - Math.abs(diffToTarget * TWEEN_FACTOR);
      return numberWithinRange(tweenValue, 0, 1);
    });
    setTweenValues(styles);
  }, [emblaApi, setTweenValues]);

  useEffect(() => {
    if (!emblaApi || !upcomingTrips) return;

    onScroll();
    emblaApi.on('scroll', () => {
      flushSync(() => onScroll());
    });
    emblaApi.on('reInit', onScroll);
  }, [emblaApi, onScroll, upcomingTrips]);

  // They are used for both skeleton and real cards so we can extract them to a variable here
  // cn is a library that allows you to conditionally concat classNames safely (avoid undefined, etc.)
  const cardClassnames = (tweenValues) =>
    cn('embla__slide__img', {
      // Center first card to the left
      '-translate-x-4': tweenValues[0] > 0.95,
      // Center last card to the right so there is no white space
      // Also center the cards when trips are not loaded yet
      'translate-x-4':
        tweenValues[tweenValues.length - 1] > 0.95 || !upcomingTrips,
    });

  return (
    <div className="embla">
      <div className="embla__viewport" ref={upcomingTrips && emblaRef}>
        <div className="embla__container">
          {/* If upcomingTrips is undefined, iterate over mockCards */}
          {(upcomingTrips || [1, 2, 3]).map((trip: TripRequestI, index) => (
            <div
              className="embla__slide"
              key={trip.id || index}
              style={{
                ...(tweenValues.length && {
                  scale: `${Math.max(0.9, tweenValues[index])}`,
                  opacity: `${tweenValues[index] ** 2}`,
                }),
              }}
            >
              {(isLoading || isError) && (
                <UpcomingCardSkeleton className={cardClassnames(tweenValues)} />
              )}
              {upcomingTrips && upcomingTrips.length > 0 && (
                <UpcomingCard
                  trip={trip}
                  className={cardClassnames(tweenValues)}
                />
              )}
            </div>
          ))}
          {upcomingTrips && upcomingTrips.length === 0 && (
            <div className="mx-4 mt-4 w-full rounded-md border border-border-color py-3 text-center text-lg font-light text-gray md:mx-5">
              No tienes ningún viaje para los próximos días.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
