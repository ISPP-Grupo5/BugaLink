import Avatar from '.';

export default function AvatarWithRating({ avatar, rating }) {
  return (
    <div className="relative">
      {/* TODO: replace with Avatar component */}
      <Avatar src={avatar} className="mx-auto w-14" />
      <div className="absolute -bottom-2 right-0 left-0 rounded-full bg-white py-[0.05rem] text-center text-xs font-semibold shadow-md outline outline-1 outline-light-gray">
        <p>⭐️ {rating.toFixed(1)}</p>
      </div>
    </div>
  );
}
