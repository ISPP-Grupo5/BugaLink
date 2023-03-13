export default function AvatarWithRating({ avatar, rating }) {
  return (
    <div className="relative">
      <img src={avatar}></img>
      <div className="absolute -bottom-2 right-0 left-0 rounded-full shadow-md text-xs text-center font-semibold py-[0.05rem] bg-white">
        <p>⭐️ {rating}</p>
      </div>
    </div>
  );
}
