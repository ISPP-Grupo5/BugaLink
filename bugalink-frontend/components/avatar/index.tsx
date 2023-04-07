import cn from 'classnames';

export default function Avatar({
  src = '',
  alt = 'Profile picture',
  className = '',
  ...props
}) {
  return (
    <img
      src={src || '/assets/anonymous-avatar.png'}
      alt={alt}
      className={cn('aspect-square rounded-full object-cover', className)}
      {...props}
    />
  );
}
