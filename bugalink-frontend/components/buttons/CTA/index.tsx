type Params = {
  text: string;
  disabled?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function CTAButton({
  text,
  disabled,
  className,
  onClick,
}: Params) {
  return (
    <button
      className={`rounded-3xl py-4 px-8 text-center text-xl tracking-wider text-white ${
        disabled ? 'bg-gray' : 'bg-turquoise'
      } ${className}`}
      disabled={disabled}
      onClick={onClick}
      data-cy="submit"
    >
      {text}
    </button>
  );
}
