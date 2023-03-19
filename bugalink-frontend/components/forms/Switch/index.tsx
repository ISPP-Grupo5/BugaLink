import { useState } from 'react';

export default function Switch() {
  const [toggle, setToggle] = useState(true);
  const toggleClass = 'transform translate-x-5';
  const toggleBgClass = ' bg-light-turquoise';

  return (
    <div className="flex flex-col items-center justify-center ">
      {/*   Switch Container */}

      <div
        className={
          'flex h-6 w-12 cursor-pointer items-center rounded-full bg-light-gray p-1' +
          (toggle ? null : toggleBgClass)
        }
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        {/* Switch */}
        <div
          className={
            'h-5 w-5 transform rounded-full bg-dark-turquoise  shadow-md duration-300 ease-in-out' +
            (toggle ? null : toggleClass)
          }
        ></div>
      </div>
    </div>
  );
}
