import TriangleDown from '../../../public/assets/triangle-down.svg';

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
      className={`flex-none text-center rounded-3xl py-1.5 px-3 text-sm ${
        selected
          ? 'bg-turquoise text-white'
          : 'bg-white text-gray border border-gray'
      }
      ${className}`}
    >
      <div className="flex items-center justify-center">
        {text}
        {!ratingOptions && <TriangleDown className="w-2 h-2 ml-1" />}
      </div>
    </button>
  );
}
