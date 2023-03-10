import React from 'react';
import Avatar from '/public/assets/avatar.svg';
import Dots from '/public/assets/dots.svg';

export default function MySchedule({ rol, avatar, date, dots }) {
  return (
    <div className="pt-4">
      <div className="card mb-5 pb-2">
        <div className="grid grid-cols-5">
          <div className="grid place-items-center mt-2 justify-start relative">
            {/* <img src={avatar} /> */}
            <Avatar />
          </div>
          <div className="grid col-span-3 place-items-center mt-2 justify-center relative">
            <p className="font-lato font-bold text-sm text-black">{date}</p>
            <p className="font-lato font-bold text-sm text-gray text-opacity-60">{rol}</p>
          </div>
          <div className="grid place-items-center mt-2 justify-end relative">
            {/* <img src={dots} /> */}
            <Dots />
          </div>
        </div>
      </div>
    </div>
  );
}
