import Link from 'next/link';
import BackButton from '../../../../../components/buttons/Back';
// import Chat from '/public/assets/chat.svg';
// import SourcePin from '/public/assets/source-pin.svg';
// import TargetPin from '/public/assets/map-mark.svg';
// import CTAButton from '../../../components/buttons/CTA';
import React, { useState } from 'react';

export default function Rating() {
  const [rating, setRating] = useState(0);
  const [button1Selected, setButton1Selected] = useState(false);
  const [button2Selected, setButton2Selected] = useState(false);
  const [button3Selected, setButton3Selected] = useState(false);

  const handleRating = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleButton1Click = () => {
    setButton1Selected(!button1Selected);
  };

  const handleButton2Click = () => {
    setButton2Selected(!button2Selected);
  };

  const handleButton3Click = () => {
    setButton3Selected(!button3Selected);
  };

  const handleSubmit = () => {
    // send rating data to server
    console.log('Submitting rating:', rating);
    console.log(`Button 1 selected: ${button1Selected}`);
    console.log(`Button 2 selected: ${button2Selected}`);
    console.log(`Button 3 selected: ${button3Selected}`);
  };

  return (
    <div className="flex justify-center h-screen bg-base">
      <BackButton />
      <div className="w-11/12 bg-white pb-44">
        {/* Profile header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '20px',
          }}
          className="flex flex-row items-center justify-between px-5 py-2 pt-20"
        >
          <div className="flex flex-row items-center">
            <img
              src="/assets/mocks/avatar1.png"
              className="w-18 h-18 rounded-full "
            />
          </div>
        </div>
        {/* User */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '20px',
          }}
          className="grid grid-cols-2 px-5 py-2 gap-2"
        >
          <div className="font-bold">
            <p className="text-xl font-Lato">Pablo Delfín López</p>
          </div>
        </div>

        {/* Details */}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {[...Array(5)].map((star, i) => {
              const ratingValue = i + 1;

              return (
                <label
                  key={i}
                  style={{
                    cursor: 'pointer',
                    fontSize: '50px',
                    margin: '0 5px',
                    color: ratingValue <= rating ? '#ffc107' : 'gray',
                  }}
                >
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    onClick={() => handleRating(ratingValue)}
                    style={{
                      position: 'absolute',
                      opacity: 0,
                      pointerEvents: 'none',
                    }}
                  />
                  ★
                </label>
              );
            })}
          </div>
          <h2 style={{ fontSize: '14px', marginBottom: '10px' }}>
            No te preocupes, las valoraciones son anónimas
          </h2>

          <div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <button
                style={{
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  backgroundColor: button1Selected ? '#38A3A5' : 'white',
                  border: '2px solid #38A3A5',
                  cursor: 'pointer',
                  margin: '10px',
                  opacity: button1Selected ? 1 : 0.5,
                  outline: 'none',
                  display: 'flex',
                  justifyContent: 'center',
                }}
                onClick={handleButton1Click}
              >
                <img
                  style={{ margin: 'auto' }}
                  src="/assets/mocks/rueda.png"
                  alt="Button 1"
                />
              </button>
              <button
                style={{
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  backgroundColor: button2Selected ? '#38A3A5' : 'white',
                  border: '2px solid #38A3A5',
                  cursor: 'pointer',
                  margin: '10px',
                  opacity: button2Selected ? 1 : 0.5,
                  outline: 'none',
                  display: 'flex',
                  justifyContent: 'center',
                }}
                onClick={handleButton2Click}
              >
                <img
                  style={{ margin: 'auto' }}
                  src="/assets/mocks/cara.png"
                  alt="Button 2"
                />
              </button>
              <button
                style={{
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  backgroundColor: button3Selected ? '#38A3A5' : 'white',
                  border: '2px solid #38A3A5',
                  cursor: 'pointer',
                  margin: '10px',
                  opacity: button3Selected ? 1 : 0.5,
                  outline: 'none',
                  display: 'flex',
                  justifyContent: 'center',
                }}
                onClick={handleButton3Click}
              >
                <img
                  style={{ margin: 'auto' }}
                  src="/assets/mocks/mano.png"
                  alt="Button 3"
                />
              </button>
            </div>
          </div>

          <button
            style={{
              marginTop: '20px',
              padding: '10px',
              borderRadius: '20px',
              backgroundColor: '#38A3A5',
              color: 'white',
              fontSize: '18px',
              cursor: 'pointer',
              width: '150px',
              height: '50px',
            }}
            onClick={handleSubmit}
          >
            ENVIAR
          </button>
        </div>
      </div>
    </div>
  );
}
