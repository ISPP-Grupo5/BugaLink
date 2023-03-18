import { useState } from 'react';

export default function Switch() {
  const [toggle, setToggle] = useState(true);
  const toggleClass = 'transform translate-x-5';

  return (
    <div className="flex flex-col items-center justify-center ">
      {/*   Switch Container */}

      <div
        className="flex h-6 w-12 cursor-pointer items-center rounded-full bg-light-gray p-1 md:h-7 md:w-14"
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        {/* Switch */}
        <div
          className={
            'h-5 w-5 transform rounded-full bg-turquoise shadow-md duration-300 ease-in-out md:h-6 md:w-6' +
            (toggle ? null : toggleClass)
          }
        ></div>
      </div>
    </div>
  );
}
