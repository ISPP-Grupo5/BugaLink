import React, { useState } from 'react';
import TagsButton from '../buttons/Tags';
import RatingFilter from './ratingFilter';
import HourFilter from './hourFilter';
import PriceFilter from './priceFilter';
import PreferencesFilter from './preferencesFilter';
import DayFilter from './dayFilter';

const SelectedUnselectedFilter = ({ filter }) => {
  const [drawerHour, setDrawerHour] = useState(false);
  const [drawerRating, setDrawerRating] = useState(false);
  const [drawerPrice, setDrawerPrice] = useState(false);
  const [drawerPreferences, setDrawerPreferences] = useState(false);
  const [drawerDay, setDrawerDay] = useState(false);

  switch (filter.name) {
    case 'Precio':
      return (
        <>
          {filter.selected ? (
            <div
              onClick={() => setDrawerPrice(true)}
              className="flex-grow-1 flex-shrink-0"
            >
              <TagsButton text={filter.selectedValue} selected />
            </div>
          ) : (
            <div
              onClick={() => setDrawerPrice(true)}
              className="flex-grow-1 flex-shrink-0"
            >
              <TagsButton text={filter.name} />
            </div>
          )}
          <PriceFilter open={drawerPrice} setOpen={setDrawerPrice} />
        </>
      );
    case 'Hora':
      return (
        <>
          {filter.selected ? (
            <div
              onClick={() => setDrawerHour(true)}
              className="flex-grow-1 flex-shrink-0"
            >
              <TagsButton text={filter.selectedValue} selected />
            </div>
          ) : (
            <div
              onClick={() => setDrawerHour(true)}
              className="flex-grow-1 flex-shrink-0"
            >
              <TagsButton text={filter.name} />
            </div>
          )}
          <HourFilter open={drawerHour} setOpen={setDrawerHour} />
        </>
      );
    case 'Valoración':
      return (
        <>
          {filter.selected ? (
            <div
              onClick={() => setDrawerRating(true)}
              className="flex-grow-1 flex-shrink-0"
            >
              <TagsButton text={filter.selectedValue} selected />
            </div>
          ) : (
            <div
              onClick={() => setDrawerRating(true)}
              className="flex-grow-1 flex-shrink-0"
            >
              <TagsButton text={filter.name} />
            </div>
          )}
          <RatingFilter open={drawerRating} setOpen={setDrawerRating} />
        </>
      );
    case 'Preferencias':
      return (
        <>
          {filter.selected ? (
            <div
              onClick={() => setDrawerPreferences(true)}
              className="flex-grow-1 flex-shrink-0"
            >
              <TagsButton text="Preferencias" selected />
            </div>
          ) : (
            <div
              onClick={() => setDrawerPreferences(true)}
              className="flex-grow-1 flex-shrink-0"
            >
              <TagsButton text={filter.name} />
            </div>
          )}
          <PreferencesFilter
            open={drawerPreferences}
            setOpen={setDrawerPreferences}
          />
        </>
      );
    case 'Día':
      return (
        <>
          {filter.selected ? (
            <div
              onClick={() => setDrawerDay(true)}
              className="flex-grow-1 flex-shrink-0"
            >
              <TagsButton text={filter.selectedValue} selected />
            </div>
          ) : (
            <div
              onClick={() => setDrawerDay(true)}
              className="flex-grow-1 flex-shrink-0"
            >
              <TagsButton text={filter.name} />
            </div>
          )}
          <DayFilter open={drawerDay} setOpen={setDrawerDay} />
        </>
      );
    default:
      return null;
  }
};

export default SelectedUnselectedFilter;
