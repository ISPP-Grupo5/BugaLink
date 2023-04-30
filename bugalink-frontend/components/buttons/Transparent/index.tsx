import cn from 'classnames';

export default function TransparentButton({
  text,
  Icon,
  disabled = false,
  ...props
}) {
  return (
    <button
      className={cn(
        { 'cursor-auto grayscale': disabled },
        'flex w-full grow rounded-2xl border-2 border-turquoise bg-transparent py-3 px-2 text-turquoise'
      )}
      {...props}
    >
      <div className="flex w-full items-center justify-evenly">
        {Icon}
        <p className="text-md mx-auto font-bold">{text}</p>
      </div>
    </button>
  );
}
