//type in  email, password...
type props = {
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | undefined;
  fieldName: string;
  content: string;
  setContent: (value: string) => void;
  parentClassName?: string;
  inputClassName?: string;
};

// Adapted from https://tailwind-elements.com/docs/standard/forms/inputs/
export default function TextField({
  type,
  fieldName,
  content,
  setContent,
  parentClassName,
  inputClassName,
}: props) {
  return (
    <div
      className={`flex relative ${parentClassName}`}
      data-te-input-wrapper-init
    >
      <input
        type={type || 'text'}
        className={`peer block text-lg min-h-[auto] bg-transparent rounded-lg border-none outline outline-1 py-3 px-4 transition-all duration-200 ease-linear outline-light-gray focus:outline-turquoise motion-reduce:transition-none ${inputClassName}`}
        onChange={(e) => setContent(e.target.value)}
        value={content}
        id={fieldName}
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
  );
}
