import useUpcomingTrips from '@/hooks/useUpcomingTrips';
import TripI from '@/interfaces/trip';
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
  const [tweenValues, setTweenValues] = useState<number[]>([]);
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
    if (!emblaApi) return;

    onScroll();
    emblaApi.on('scroll', () => {
      flushSync(() => onScroll());
    });
    emblaApi.on('reInit', onScroll);
  }, [emblaApi, onScroll]);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {isLoading || isError ? (
            <CarouselSkeleton tweenValues={tweenValues} />
          ) : (
            upcomingTrips.map((trip: TripI, index) => (
              <div
                className="embla__slide"
                key={trip.id}
                style={{
                  ...(tweenValues.length && {
                    scale: `${Math.max(90, tweenValues[index] * 100)}%`,
                    opacity: tweenValues[index] ** 2,
                  }),
                }}
              >
                <UpcomingCard
                  trip={trip}
                  key={trip.id}
                  className={
                    'embla__slide__img transition-transform duration-200' +
                    // Center first card to the left
                    (tweenValues[0] > 0.95 ? '-translate-x-4 ' : '') +
                    // Center last card to the right so there is no white space
                    (tweenValues[tweenValues.length - 1] > 0.95
                      ? 'translate-x-4'
                      : '')
                  }
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const CarouselSkeleton = ({ tweenValues }) => {
  return (
    <>
      {[1, 2, 3].map((i, index) => (
        <div
          className="embla__slide transition-transform duration-100"
          key={i}
          style={{
            ...{
              scale: `${Math.max(90, tweenValues[index] * 100)}%`,
              opacity: tweenValues[index] ** 2,
            },
          }}
        >
          <UpcomingCardSkeleton />
        </div>
      ))}
    </>
  );
};
