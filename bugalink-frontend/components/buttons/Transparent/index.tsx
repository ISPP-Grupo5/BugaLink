type Params = {
    text: string;
    Icon: any;
  };


export default function Transparent({text, Icon}: Params){
    return (
        <button
          className={`relative rounded-2xl bg-transparent py-3 px-12 text-turquoise border-2 border-turquoise `}

        >
          {Icon}  
          <p className="text-right text-xs font-bold  translate-x-4">{text}</p>
        </button>
      );
}