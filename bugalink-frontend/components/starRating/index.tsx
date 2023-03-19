import Star from '/public/assets/star.svg'

export default function StarRating({ value, setValue }) {
    return (
      // Star used for giving ratings to users after a ride
      <div className="flex items-center space-x-5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            selected={star <= value}
            onClick={() => setValue(star)}
            className={`cursor-pointer ${
              star <= value ? 'grayscale-0' : 'grayscale'
            }`}

          />
        ))}
        </div>
    );
        }