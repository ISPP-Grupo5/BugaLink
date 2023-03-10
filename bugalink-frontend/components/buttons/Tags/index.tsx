type Params = {
  text: string;
  selected?: boolean;
  className?: string;
};

export default function TagsButton({
  text,
  selected = false,
  className = '',
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
      {text} ⏷
    </button>
  );
}
