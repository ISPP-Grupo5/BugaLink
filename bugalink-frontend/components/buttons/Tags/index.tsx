import TriangleDown from '/public/assets/triangle-down.svg';

type Params = {
  text: string;
  selected?: boolean;
  className?: string;
  ratingOptions?: boolean;
};

export default function TagsButton({
  text,
  selected = false,
  className = '',
  ratingOptions = false,
}: Params) {
  return (
    <button
      className={`flex-none whitespace-nowrap rounded-3xl py-1.5 px-3 text-center text-sm ${
        selected
          ? 'bg-turquoise text-white'
          : 'bg-white text-gray outline outline-1 outline-gray'
      }
      ${className}`}
    >
      <div className="flex items-center justify-center">
        {text}
        {!ratingOptions && <TriangleDown className="ml-1 h-2 w-2" />}
      </div>
    </button>
  );
}
