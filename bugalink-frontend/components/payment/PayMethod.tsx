import cn from 'classnames';
import { HTMLAttributes } from 'react';
import ArrowRightWhite from '/public/assets/arrow-right-white.svg';

interface PayMethodProps extends HTMLAttributes<HTMLElement> {
  logo: any;
  name: string;
  data: string;
  disabled?: boolean;
}

export default function PayMethod({
  logo,
  name,
  data,
  disabled = false,
  ...props
}: PayMethodProps) {
  return (
    <button
      className={cn(
        {
          'cursor-auto grayscale': disabled,
        },
        'my-2 grid h-32 w-full grid-cols-3 items-center justify-center rounded-xl border border-light-gray p-2 shadow-md'
      )}
      {...props}
    >
      <div
        className={`flex h-5/6 w-5/6 justify-center rounded-2xl ${
          name == 'Saldo' ? 'bg-turquoise p-1' : 'bg-light-gray p-3'
        }`}
      >
        {logo}
      </div>
      <div>
        <p className="text-xl font-bold">{name}</p>
        <p className="text-sm text-gray">{data}</p>
      </div>
      <div className="ml-auto mr-1">
        <p
          className={` rounded-xl px-2 py-3 ${
            name == 'Saldo' ? 'bg-turquoise' : 'bg-black'
          }`}
        >
          <ArrowRightWhite />
        </p>
      </div>
    </button>
  );
}
