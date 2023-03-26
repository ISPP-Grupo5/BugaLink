import { useState } from 'react';
import Upload from 'public/assets/upload.svg';
import GreenCheck from 'public/assets/green-check.svg';

type Params = {
  text: string;
};

export default function FileButton({ text }: Params) {
  const [open, setOpen] = useState(false);
  const [upload, setUpload] = useState(true);
  const BgCheckClass = 'bg-green text-white';
  const BgUnckeckClass = 'border-2 text-gray border-gray';

  function handleClick() {
    setOpen(!open);
  }

  function handleUpload() {
    setUpload(!upload);
  }

  return (
    <div>
      <button
        className={
          'w-full rounded-md pl-2 text-left text-base ' +
          (upload ? BgUnckeckClass : BgCheckClass)
        }
        onClick={handleClick}
      >
        <span className='flex flex-row justify-between'>
            <p className='my-auto'> {text} </p>
            {upload ? <Upload className="mr-0.5"/> :  <GreenCheck className="stroke-green fill-green mr-0.5"/> }
        </span>
        
      </button>
      {open && (
        <input
          className="block w-full text-sm border-b-2 border-x-2 border-black rounded-b-lg bg-light-gray text-gray file:bg-gray-select file:text-gray"
          type="file"
          onChange={handleUpload}
        ></input>
      )}
    </div>
  );
}
