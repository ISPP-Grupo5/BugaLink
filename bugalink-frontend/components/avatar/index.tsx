import cn from 'classnames';
import Image from 'next/image';

export default function Avatar({
  src = '',
  alt = 'Profile picture',
  className = '',
  ...props
}) {
  const host = process.env.NEXT_PUBLIC_BACKEND_URL;
  const urlPhoto = host+src;

  return (
    <Image
      width={100}
      height={100}
      src={src ? urlPhoto : '/assets/anonymous-avatar.png'}
      alt={alt}
      className={cn('aspect-square rounded-full object-cover', className)}
      {...props}
    />
  );
}
