import UserStatsI from '@/interfaces/userStats';
import { shortenName } from '@/utils/formatters';
import cn from 'classnames';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import Avatar from '../avatar';
import Chat from '/public/assets/chat.svg';
import Link from 'next/link';
import NEXT_ROUTES from '@/constants/nextRoutes';
import { useRouter } from 'next/router';

type Params = {
  user: UserStatsI;
  className?: string;
};

export default function ProfileHeader({ user, className = '' }: Params) {
  const { data } = useSession();
  const router = useRouter();

  const me = data?.user as User;
  const isMyProfile = me?.user_id === user.id;

  return (
    <div
      className={cn(
        'flex flex-row items-center justify-between space-x-4',
        className
      )}
    >
      {/* Profile header */}
      <div className="flex flex-row items-start space-x-3">
        <Avatar src={user.photo} className="h-11 w-11" />
        <div className="grid grid-rows-2 -space-y-0.5">
          <p className="truncate text-lg font-bold">
            {shortenName(user.first_name, user.last_name)}
          </p>
          <p className="text-xs font-normal">
            {user.number_ratings > 0
              ? `⭐ ${user.rating} · ${user.number_ratings} valoraciones`
              : 'Sin valoraciones'}
          </p>
        </div>
      </div>
      <div className="flex -translate-y-1 space-x-1">
        {!isMyProfile && (
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border border-turquoise"
            onClick={() => router.push(NEXT_ROUTES.CHAT(user.id))}
          >
            <Chat className="h-3 w-3" />
          </button>
        )}
        <Link
          href={NEXT_ROUTES.PROFILE(user.id)}
          className="flex items-center justify-center rounded-full border border-turquoise"
        >
          <p className="px-2 py-1 text-base font-bold text-turquoise">
            Ver perfil
          </p>
        </Link>
      </div>
    </div>
  );
}
