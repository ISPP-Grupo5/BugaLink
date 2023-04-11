import cn from 'classnames';

type Props = {
  children: React.ReactNode;
  title: string;
  className?: string;
};

export default function Entry({ children, title, className }: Props) {
  return (
    <div className="flex flex-col leading-4">
      <p className={cn('text-xs font-thin text-gray', className)}>{title}</p>
      <div className="flex flex-row items-center space-x-1 text-sm font-medium">
        {children}
      </div>
    </div>
  );
}
