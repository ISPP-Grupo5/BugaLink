import React from 'react';
import Avatar from '/public/assets/avatar.svg';
import MapPin from '/public/assets/map-pin.svg';
import OrigenPin from '/public/assets/origen-pin.svg';
import Star from '/public/assets/star.svg';
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
    <div className="card border-[#DADADA] border-solid border-2 rounded mb-5 w-11/12">
      <div className="grid grid-cols-3 gap-x-10 items-center">
        <div className="grid place-items-center mt-2 justify-end relative">
          {/* <img src={avatar} /> */}
          <Avatar />
          <button className="flex items-center justify-center border-[#DADADA] border-solid border rounded-full 
            shadow-md text-black font-lato font-semibold text-[12px] bg-white relative mt-[-15%] w-11 h-4">
            <Star /> {rating}
          </button>
        </div>
        <span className="font-lato font-thin text-[12px] text-[#696969] col-span-2">
          {type}
          <p className="font-lato font-bold text-[14px] text-black">{name}</p>
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-10 gap-y-0 grid-rows-4">
        <span className="font-lato text-[11px] text-[#464646] ml-3">
          Origen
        </span>
        <span className="font-lato text-[11px] text-[#464646] mr-2">
          Destino
        </span>
        <span className=" flex items-center font-lato font-bold text-[12px] ml-3">
          <span>
            <OrigenPin />
          </span>
          <span className="truncate">{origin}</span>
        </span>
        <span className="flex items-center font-lato font-bold text-[12px] mr-2">
          <span>
            <MapPin />
          </span>
          <span className="truncate">{destination}</span>
        </span>
        <span className="font-lato text-[11px] text-[#464646] ml-3">
          Fecha y hora
        </span>
        <span className="font-lato text-[11px] text-[#464646] mr-2">
          Precio por asiento
        </span>
        <span className="flex items-center font-lato font-bold text-[12px] ml-3 truncate">
          <span>
            <Calendar />
          </span>
          <span className="truncate">{date}</span>
        </span>
        <span className="font-lato font-bold text-[12px] mr-2 truncate">
          {price}
        </span>
      </div>
    </div>
  );
}
