import React from 'react';
import Avatar from '/public/assets/avatar.svg';
import Dots from '/public/assets/dots.svg';


export default function TripCard({
    day,
    name,
    avatar,
    date,
    dots,
  }) {
    return (
      <div className="card border-border-color border-solid border rounded mb-5 pb-2 w-11/12">
        {day}
        <div className="grid grid-cols-3 gap-x-10 items-center">
          <div className="grid place-items-center mt-2 justify-end relative">
            {/* <img src={avatar} /> */}
            <Avatar />
          </div>
          <div className="grid place-items-center mt-2 justify-end relative">
            {date}
            {name}
          </div>
          <div className="grid place-items-center mt-2 justify-end relative">
            {/* <img src={dots} /> */}
            <Dots />
          </div>
        </div>
      </div>
    );
  }
  