import Chat from '/public/assets/chat.svg';

type Params = {
  name: string;
  rating: string;
  numberOfRatings: string;
  className?: string;
  photo: string;
};

export default function ProfileHeader({
  name,
  rating,
  numberOfRatings,
  className = '',
  photo,
}: Params) {
  return (
    <div
      className={
        'flex flex-row items-center justify-between space-x-4 ' + className
      }
    >
      {/* Profile header */}
      <div className="flex flex-row items-start space-x-3">
        <img src={photo} className="h-11 w-11 rounded-full" />
        <div className="grid grid-rows-2 -space-y-0.5">
          <p className="truncate text-lg font-bold">{name}</p>
          <p className="text-xs font-normal">
            ⭐ {rating} - {numberOfRatings} valoraciones
          </p>
        </div>
      </div>
      <div className="flex -translate-y-1 space-x-1">
        <button className="flex h-7 w-7 items-center justify-center rounded-full border border-turquoise">
          <Chat className="h-3 w-3" />
        </button>
        <button className="flex h-7 w-20 items-center justify-center rounded-full border border-turquoise">
          <p className="text-xs font-bold text-turquoise">Ver perfil</p>
        </button>
      </div>
    </div>
  );
}
