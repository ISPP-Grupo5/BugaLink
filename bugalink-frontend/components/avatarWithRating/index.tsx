export default function AvatarWithRating({ avatar, rating }) {
  return (
    <div className="relative">
      <img
        src={avatar ?? '/assets/anonymus-avatar.png'}
        className="mx-auto aspect-square w-14 rounded-full"
      ></img>
      <div className="absolute -bottom-2 right-0 left-0 rounded-full bg-white py-[0.05rem] text-center text-xs font-semibold shadow-md outline outline-1 outline-light-gray">
        <p>⭐️ {rating.toFixed(1)}</p>
      </div>
    </div>
  );
}
