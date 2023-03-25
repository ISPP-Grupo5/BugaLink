type Params = {
  text: string;
  Icon: any;
};

export default function TransparentButton({ text, Icon }: Params) {
  return (
    <button className="flex grow rounded-2xl border-2 border-turquoise bg-transparent py-3 px-2 text-turquoise w-full">
      <div className="flex w-full items-center justify-evenly">
        {Icon}
        <p className="text-md mx-auto font-bold">{text}</p>
      </div>
    </button>
  );
}
