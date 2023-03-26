import Star from '/public/assets/star.svg';

// <RatingButton text="Buena conducción" icon="🛞" selected={goodConduction} setSelected={setGoodConduction}/>
export default function RatingButton({ text, icon, selected, setSelected }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <button
        className={`aspect-square rounded-full p-3 text-4xl shadow-xl outline outline-1 outline-turquoise 
        ${selected ? 'bg-turquoise' : 'bg-white'}`}
        onClick={() => setSelected(!selected)}
      >
        {icon}
      </button>
      <p className="text-md text-center leading-5 text-dark-gray">{text}</p>
    </div>
  );
}
