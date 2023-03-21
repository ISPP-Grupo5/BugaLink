type Params = {
    text: string;
    Icon: any;
  };


export default function Transparent({text, Icon}: Params){
    return (
        <button
          className={`relative rounded-2xl bg-transparent py-3 px-6  w-full text-turquoise border-2 border-turquoise flex flex-row `}

        >
          {Icon}  
          <p className="text-right text-xs font-bold w-full">{text}</p>
        </button>
      );
}