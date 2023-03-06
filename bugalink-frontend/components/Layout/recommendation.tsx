import React from 'react';
import Avatar from '/public/assets/avatar.svg';
import MapPin from '/public/assets/map-pin.svg';
import OrigenPin from '/public/assets/origen-pin.svg';
import Calendar from '/public/assets/calendar.svg';

export default function TripCard({
  type,
  rating,
  name,
  avatar,
  origin,
  destination,
  date,
  price,
}) {
  return (
    <div className="card border-border-color border-solid border rounded mb-5 pb-2 w-11/12">
      <div className="grid grid-cols-3 gap-x-10 items-center">
        <div className="grid place-items-center mt-2 justify-end relative">
          {/* <img src={avatar} /> */}
          <Avatar />
          <button
            className="flex items-center justify-center border-gray border-solid border rounded-full 
            shadow-md text-black font-lato font-semibold text-xs bg-white relative -mt-2 w-11 h-4"
          >
            ⭐ {rating}
          </button>
        </div>
        <span className="font-lato font-thin text-xs text-gray col-span-2">
          {type}
          <p className="font-lato font-bold text-sm text-black">{name}</p>
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-10 gap-y-0 grid-rows-2 mb-2">
        <span className="font-lato text-xs text-dark-grey ml-3">Origen</span>
        <span className="font-lato text-xs text-dark-grey mr-2">Destino</span>
        <span className=" flex items-center font-lato font-bold text-xs ml-3">
          <span>
            <OrigenPin />
          </span>
          <span className="truncate ml-1">{origin}</span>
        </span>
        <span className="flex items-center font-lato font-bold text-xs mr-2">
          <span>
            <MapPin />
          </span>
          <span className="truncate ml-1">{destination}</span>
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-10 gap-y-0 grid-rows-2">
        <span className="font-lato text-xs text-dark-grey ml-3">
          Fecha y hora
        </span>
        <span className="font-lato text-xs text-dark-grey mr-2">
          Precio por asiento
        </span>
        <span className="flex items-center font-lato font-bold text-xs ml-3 truncate">
          <span>
            <Calendar />
          </span>
          <span className="truncate ml-1">{date}</span>
        </span>
        <span className="font-lato font-bold text-xs mr-2 truncate">
          {price}
        </span>
      </div>
    </div>
  );
}
