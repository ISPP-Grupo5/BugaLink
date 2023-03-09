import { ChangeEvent, useState } from 'react';

type props = {
  fieldName: string;
  content: string;
  setContent: (value: string) => void;
  parentClassName?: string;
  inputClassName?: string;
  maxLength?: number;
};

// Adapted from https://tailwind-elements.com/docs/standard/forms/textarea/
export default function TextAreaField({
  fieldName,
  content,
  setContent,
  parentClassName,
  inputClassName,
  maxLength = 2000,
}: props) {
  const [counter, setCounter] = useState(0);

  const onChangeTextarea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setCounter(e.target.value.length);
  };

  return (
    <>
      <div
        className={`flex relative ${parentClassName}`}
        data-te-input-wrapper-init
      >
        <textarea
          className={`peer block text-lg min-h-[auto] bg-transparent rounded-lg border-none outline outline-1 py-3 px-4 transition-all duration-200 ease-linear outline-light-gray focus:outline-turquoise motion-reduce:transition-none ${inputClassName}`}
          onChange={onChangeTextarea}
          value={content}
          id={fieldName}
          rows={12}
          maxLength={maxLength}
        />
        <label
          onSelectCapture={(e) => e.preventDefault()} // Prevents context menu from opening when selecting text
          htmlFor={fieldName}
          className={`pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-3 px-1.5 text-light-gray bg-transparent transition-all duration-200 ease-out peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:bg-white peer-focus:text-turquoise ${
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
