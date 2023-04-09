import { ChangeEvent, useState } from 'react';

type props = {
  fieldName: string;
  content: string;
  setContent: (value: string) => void;
  parentClassName?: string;
  inputClassName?: string;
  maxLength?: number;
  rows?: number;
};

// Adapted from https://tailwind-elements.com/docs/standard/forms/textarea/
export default function TextAreaField({
  fieldName,
  content,
  setContent,
  parentClassName,
  inputClassName,
  maxLength = 2000,
  rows,
}: props) {
  const [counter, setCounter] = useState(0);

  const onChangeTextarea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setCounter(e.target.value.length);
  };

  return (
    <>
      <div
        className={`relative flex ${parentClassName}`}
        data-te-input-wrapper-init
      >
        <textarea
          className={`peer block min-h-[auto] cursor-text rounded-sm border-none bg-transparent py-3 px-4 text-lg outline outline-1 outline-gray-select transition-all duration-200 ease-linear hover:outline-black focus:outline-2 focus:outline-light-turquoise motion-reduce:transition-none ${inputClassName}`}
          onChange={onChangeTextarea}
          value={content}
          id={fieldName}
          rows={rows || 12}
          maxLength={maxLength}
        />
        <label
          onSelectCapture={(e) => e.preventDefault()} // Prevents context menu from opening when selecting text
          htmlFor={fieldName}
          className={`pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate bg-transparent px-1.5 pt-3 text-gray-text-select transition-all duration-200 ease-out peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:bg-white peer-focus:text-turquoise ${
            content === '' ? '' : '-translate-y-5 scale-75 bg-white'
          }  motion-reduce:transition-none`}
        >
          {fieldName}
        </label>
      </div>
      <div className="flex justify-end">
        <p className="text-gray">
          {counter}/{maxLength}
        </p>
      </div>
    </>
  );
}
