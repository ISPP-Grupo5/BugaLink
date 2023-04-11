import cn from 'classnames';
import Image from 'next/image';

export default function Avatar({
  src = '',
  alt = 'Profile picture',
  className = '',
  ...props
}) {
  return (
    <Image
      width={100}
      height={100}
      src={src || '/assets/anonymous-avatar.png'}
      alt={alt}
      className={cn('aspect-square rounded-full object-cover', className)}
      {...props}
    />
  );
}