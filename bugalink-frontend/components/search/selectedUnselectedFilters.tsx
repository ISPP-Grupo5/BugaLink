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
              <TagsButton text={filter.name} selected />
            </div>
          ) : (
            <div
              onClick={() => setDrawerPrice(true)}
              className="flex-grow-1 flex-shrink-0"
            >
              <TagsButton text={filter.name} />
            </div>
          )}
          <PriceFilter open={drawerPrice} setOpen={setDrawerPrice} minPrice={filter.minPrice} maxPrice={filter.maxPrice} setMinPrice={filter.setMinPrice} setMaxPrice={filter.setMaxPrice} />
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
              <TagsButton text={filter.name} selected />
            </div>
          ) : (
            <div
              onClick={() => setDrawerHour(true)}
              className="flex-grow-1 flex-shrink-0"
            >
              <TagsButton text={filter.name} />
            </div>
          )}
          <HourFilter
            open={drawerHour}
            setOpen={setDrawerHour}
            hourFrom={filter.hourFrom}
            hourTo={filter.hourTo}
            setHourFrom={filter.setHourFrom}
            setHourTo={filter.setHourTo}
          />
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
              <TagsButton text={filter.name} selected />
            </div>
          ) : (
            <div
              onClick={() => setDrawerRating(true)}
              className="flex-grow-1 flex-shrink-0"
            >
              <TagsButton text={filter.name} />
            </div>
          )}
          <RatingFilter open={drawerRating} setOpen={setDrawerRating} minStars={filter.minStars} />
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
              <TagsButton text={filter.name} selected />
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
            allowsPets={filter.allowsPets}
            allowsSmoking={filter.allowsSmoking}
            prefersTalk={filter.prefersTalk}
            prefersMusic={filter.prefersMusic}
            setAllowsPets={filter.setAllowsPets}
            setAllowsSmoking={filter.setAllowsSmoking}
            setPrefersMusic={filter.setPrefersMusic}
            setPrefersTalk={filter.setPrefersTalk}
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
              <TagsButton text={filter.name} selected />
            </div>
          ) : (
            <div
              onClick={() => setDrawerDay(true)}
              className="flex-grow-1 flex-shrink-0"
            >
              <TagsButton text={filter.name} />
            </div>
          )}
          <DayFilter
            open={drawerDay}
            setOpen={setDrawerDay}
            dateFrom={filter.dateFrom}
            dateTo={filter.dateTo}
            setDateFrom={filter.setDateFrom}
            setDateTo={filter.setDateTo}
          />
        </>
      );
    default:
      return null;
  }
};

export default SelectedUnselectedFilter;
