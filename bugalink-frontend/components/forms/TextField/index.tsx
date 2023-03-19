//type in  email, password...
type props = {
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'date'
    | 'tel'
    | 'textarea'
    | undefined;
  fieldName: string;
  content: string;
  setContent: (value: string) => void;
  parentClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
};

// Adapted from https://tailwind-elements.com/docs/standard/forms/inputs/
export default function TextField({
  type,
  fieldName,
  content,
  setContent,
  parentClassName,
  inputClassName,
  disabled,
}: props) {
  return (
    <div
      className={`relative flex ${parentClassName}`}
      data-te-input-wrapper-init
    >
      <input
        type={type || 'text'}
        className={`peer block min-h-[auto] rounded-lg border-none bg-transparent py-3 px-4 text-lg outline outline-1 outline-light-gray transition-all duration-200 ease-linear focus:outline-turquoise motion-reduce:transition-none ${inputClassName}`}
        onChange={(e) => setContent(e.target.value)}
        value={content}
        id={fieldName}
        disabled={disabled}
      />
      <label
        onSelectCapture={(e) => e.preventDefault()} // Prevents context menu from opening when selecting text
        htmlFor={fieldName}
        className={`pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate bg-transparent px-1.5 pt-3 text-light-gray transition-all duration-200 ease-out peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:bg-white peer-focus:text-turquoise ${
          content === '' ? '' : '-translate-y-5 scale-75 bg-white'
        }  motion-reduce:transition-none`}
      >
        {fieldName}
      </label>
    </div>
  );
}
