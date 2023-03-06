type Params = {
  text: string;
  disabled?: boolean;
  className?: string;
};

export default function CTAButton({ text, disabled, className }: Params) {
  return (
    <button
      className={`bg-turquoise text-center tracking-wider text-white rounded-3xl py-4 px-8 text-xl ${className}`}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
