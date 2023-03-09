type props = {
  label: string;
  id: string;
  options: { value: string; label: string }[];
  parentClassName?: string;
  inputClassName?: string;
  selectedOption?: string;
  setSelectedOption?: (value: string) => void;
};

// Adapted from https://tailwind-elements.com/docs/standard/forms/select/
export default function SelectField({
  label,
  id,
  options,
  parentClassName,
  inputClassName,
  selectedOption,
  setSelectedOption,
}: props) {
  return (
    <div
      className={`flex relative ${parentClassName}`}
      data-te-input-wrapper-init
    >
      <select
        className={`peer block text-lg min-h-[auto] bg-transparent rounded-lg border-none outline outline-1 py-3 px-4 transition-all duration-200 ease-linear outline-light-gray focus:outline-turquoise motion-reduce:transition-none ${inputClassName}`}
        onChange={(e) => setSelectedOption(e.target.value)}
        value={selectedOption}
        id={id}
      >
        <option value="" disabled hidden />
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="checked:color-turquoise"
          >
            {option.label}
          </option>
        ))}
      </select>
      <label
        onSelectCapture={(e) => e.preventDefault()}
        htmlFor={id}
        className={`pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-3 px-1.5 text-light-gray bg-transparent transition-all duration-200 ease-out peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:bg-white peer-focus:text-turquoise ${
          selectedOption === '' ? '' : '-translate-y-5 scale-75 bg-white'
        }  motion-reduce:transition-none`}
      >
        {label}
      </label>
    </div>
  );
}
