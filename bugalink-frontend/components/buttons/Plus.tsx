import React, { useState } from 'react';

function DropdownButton() {
  const [showDropdown, setShowDropdown] = useState(false);

  function toggleDropdown() {
    setShowDropdown((prevState) => !prevState);
  }
  return (
    <button
      id="menu-button"
      aria-expanded="true"
      aria-haspopup="true"
      onClick={toggleDropdown}
      type="button"
      className="sticky bottom-5 left-full w-min text-white bg-[#38A3A5] font-lato rounded-full shadow-xl text-5xl px-5 py-2.5 font-bold text-center mr-2 mb-2"
    >
      +
      {showDropdown && (
        <div
          className="origin-top-left absolute bottom-20 right-0 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="" role="none">
            <button
              type="button"
              className="w-full text-left px-4  font-lato text-base text-gray"
              role="menuitem"
            >
              Conductor
            </button>
            <button
              type="button"
              className="w-full text-left px-4 pb-4 font-lato text-base text-gray"
              role="menuitem"
            >
              Pasajero
            </button>
          </div>
        </div>
      )}
    </button>
  );
}
export default DropdownButton;
