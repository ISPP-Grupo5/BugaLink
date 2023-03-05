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
  placeholder: string;
  content: string;
  setContent: (value: string) => void;
  parentClassName?: string;
  inputClassName?: string;
};

// Adapted from https://tailwind-elements.com/docs/standard/forms/inputs/
export default function TextField({
  type,
  fieldName,
  placeholder,
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
        className={`peer block text-lg min-h-[auto] bg-transparent rounded-lg border-none outline outline-[0.125rem] py-3 px-4 transition-all duration-200 ease-linear outline-light-gray focus:outline-turquoise focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0 ${inputClassName}`}
        placeholder={placeholder || 'Example label'}
        onChange={(e) => setContent(e.target.value)}
        value={content}
        id={fieldName}
        data-te-input-state-active={content === '' ? undefined : true} // Move the label up when the input is not empty
      />
      <label
        onSelectCapture={(e) => e.preventDefault()} // Prevents context menu from opening when selecting text
        htmlFor={fieldName}
        className="pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-3 px-1.5 text-light-gray bg-transparent transition-all duration-200 ease-out peer-focus:-translate-y-[1.2rem] peer-focus:scale-[0.8] peer-focus:text-turquoise peer-data-[te-input-state-active]:-translate-y-[1.2rem] peer-data-[te-input-state-active]:scale-[0.8] peer-focus:bg-white peer-data-[te-input-state-active]:bg-white motion-reduce:transition-none"
      >
        {fieldName}
      </label>
    </div>
  );
}
