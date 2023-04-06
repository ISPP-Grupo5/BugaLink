import { useState } from 'react';
import Upload from 'public/assets/upload.svg';
import GreenCheck from 'public/assets/green-check.svg';

type Params = {
  text: string;
  upload: boolean;
  setUpload: (upload: boolean) => void;
};

export default function FileButton({ text, upload, setUpload }: Params) {
  return (
    <div>
      <label
        htmlFor={text}
        className={
          'flex w-full flex-row justify-between rounded-md p-1 text-left text-base ' +
          (upload ? 'bg-green text-white' : 'border-2 border-gray text-gray')
        }
      >
        <p className="my-auto"> {text} </p>
        {upload ? (
          <GreenCheck className="fill-green stroke-green" />
        ) : (
          <Upload className="" />
        )}
      </label>
      <input
        className="hidden"
        id={text}
        type="file"
        onChange={() => setUpload(true)}
      />
    </div>
  );
}
