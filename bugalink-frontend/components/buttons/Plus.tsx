import React, { useState } from 'react';

function DropdownButton() {
  const [showDropdown, setShowDropdown] = useState(false);

  function toggleDropdown() {
    setShowDropdown((prevState) => !prevState);
  }
  return (
    <div className="items-center justify-end absolute bottom-5 right-5 inline-block">
      <button
        id="menu-button"
        aria-expanded="true"
        aria-haspopup="true"
        onClick={toggleDropdown}
        type="button"
        className="absolute bottom-0 right-0 text-white bg-[#38A3A5] font-lato rounded-full shadow-xl text-5xl px-5 py-2.5 font-bold text-center mr-2 mb-2"
      >
        +
      </button>
      {showDropdown && (
        <div
          className="origin-top-left relative bottom-20 right-0 mb-2 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            <button
              type="button"
              className="w-full text-left px-4 py-2 font-lato text-s text-gray"
              role="menuitem"
            >
              Conductor
            </button>
            <button
              type="button"
              className="w-full text-left px-4 py-1 font-lato text-s text-gray"
              role="menuitem"
            >
              Pasajero
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default DropdownButton;
