import Chat from '/public/assets/chat.svg';

export default function ProfileHeader() {
  return (
    <div>
      {/* Profile header */}
      <div className="flex flex-row items-center justify-between py-2">
        <div className="flex flex-row items-center">
          <img
            src="/assets/mocks/profile1.png"
            className="w-11 h-11 rounded-full"
          />
          <div className="flex flex-col ml-3">
            <p className="text-lg font-bold leading-normal">Jesús Marchena</p>
            <p className="text-xs font-normal">⭐ 4.8 - 14 valoraciones</p>
          </div>
          <div className="flex flex-col ml-5">
            <button className="rounded-full w-7 h-7 flex items-center justify-center border border-turquoise">
              <Chat className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-col ml-3">
            <button className="rounded-full w-20 h-7 flex items-center justify-center border border-turquoise">
              <p className="text-xs font-bold text-turquoise">Ver perfil</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
