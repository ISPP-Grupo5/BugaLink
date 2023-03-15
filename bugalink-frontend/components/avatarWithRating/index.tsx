export default function AvatarWithRating({ avatar, rating }) {
  return (
    <div className="relative">
      <img src={avatar}></img>
      <div className="absolute -bottom-2 right-0 left-0 rounded-full bg-white py-[0.05rem] text-center text-xs font-semibold shadow-md">
        <p>⭐️ {rating.toFixed(1)}</p>
      </div>
    </div>
  );
}
