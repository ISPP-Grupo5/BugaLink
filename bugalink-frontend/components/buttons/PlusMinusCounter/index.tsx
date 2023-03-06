type Props = {
  onMinusClick: () => void;
  onPlusClick: () => void;
  text: string;
};

export default function PlusMinusCounter({
  onMinusClick,
  onPlusClick,
  text,
}: Props) {
  return (
    <div className="relative w-full text-center bg-base font-semibold p-1 rounded-xl flex justify-between items-center">
      <button
        onClickCapture={(e) => {
          e.preventDefault();
        }}
        className="w-10 h-10 bg-white rounded-lg text-xl flex items-center justify-center"
        onClick={onMinusClick}
      >
        —
      </button>
      <p className="text-xl">{text}</p>
      <button
        onClickCapture={(e) => {
          e.preventDefault();
        }}
        className="w-10 h-10 bg-white rounded-lg text-2xl flex items-center justify-center"
        onClick={onPlusClick}
      >
        +
      </button>
    </div>
  );
}
