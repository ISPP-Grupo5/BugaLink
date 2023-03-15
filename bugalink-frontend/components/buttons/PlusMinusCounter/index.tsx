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
    <div className="relative flex w-full items-center justify-between rounded-xl bg-base-origin p-1 text-center font-semibold">
      <button
        onClickCapture={(e) => {
          e.preventDefault();
        }}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-xl"
        onClick={onMinusClick}
      >
        —
      </button>
      <p className="text-xl">{text}</p>
      <button
        onClickCapture={(e) => {
          e.preventDefault();
        }}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-2xl"
        onClick={onPlusClick}
      >
        +
      </button>
    </div>
  );
}
