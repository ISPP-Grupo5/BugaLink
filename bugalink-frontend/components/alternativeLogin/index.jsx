import RoundedButton from '../buttons/Rounded';
import Facebook from '../../public/icons/Login/facebook.svg';
import Twitter from '../../public/icons/Login/twitter.svg';
import Google from '../../public/icons/Login/google.svg';

export default function AlternativeLogin() {
  return (
    <span>
      <div className="flex flex-row items-center justify-center space-x-5">
        <RoundedButton
          link="#"
          Icon={<Facebook className="ml-1 h-8 w-8 scale-125" />}
        />
        <RoundedButton link="#" Icon={<Twitter className="ml-1.5 h-7 w-7" />} />
        <RoundedButton
          link="#"
          Icon={<Google className="ml-1.5 h-7 w-7 fill-red" />}
        />
      </div>
      <p className="font-bold text-light-gray">o usa tu cuenta de correo</p>
    </span>
  );
}
