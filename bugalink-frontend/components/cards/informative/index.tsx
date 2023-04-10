import cn from 'classnames';

export default function InformativeCard({
  children,
  className = '',
  ...props
}) {
  return (
    <div
      className={cn(
        'w-full rounded-md border border-border-color py-3 text-center text-lg font-light text-gray',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
