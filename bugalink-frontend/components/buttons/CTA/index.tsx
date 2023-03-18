type Params = {
  text: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;

  
};

export default function CTAButton({ text, disabled, className, onClick}: Params) {
  return (
    <button
      className={`rounded-3xl bg-turquoise py-4 px-8 text-center text-xl tracking-wider text-white ${className}`}
      disabled={disabled}
      onClick={onClick}
      
    >
      {text}
    </button>
  );
}
