import RoundedButton from '@/components/buttons/Rounded';
import Facebook from '/public/icons/Login/facebook.svg';
import Twitter from '/public/icons/Login/twitter.svg';
import Google from '/public/icons/Login/google.svg';

export default function ExternalLogin() {
  return (
    <div className="flex flex-row items-center justify-center space-x-5 grayscale">
      <RoundedButton
        href=""
        Icon={<Facebook className="ml-1 h-8 w-8 scale-125" />}
      />
      <RoundedButton href="" Icon={<Twitter className="ml-1.5 h-7 w-7" />} />
      <RoundedButton
        href=""
        Icon={<Google className="ml-1.5 h-7 w-7 fill-red" />}
      />
    </div>
  );
}
