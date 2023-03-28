import EyeIcon from '@/public/assets/eye.svg';
import EyeOffIcon from '@/public/assets/eye-off.svg';

//type in  email, password...
type props = {
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | undefined;
  fieldName: string;
  name?: string;
  content: string;
  setContent: (value: string) => void;
  parentClassName?: string;
  inputClassName?: string;
  showPassword?: boolean;
  setShowPassword?: (value: boolean) => void;
  error?: string;
  props?: any;
};

// Adapted from https://tailwind-elements.com/docs/standard/forms/inputs/
export default function TextField({
  type,
  fieldName,
  name,
  content,
  setContent,
  parentClassName,
  inputClassName,
  showPassword,
  setShowPassword,
  error,
  ...props
}: props) {
  return (
    <div
      className={`relative flex ${parentClassName}`}
      data-te-input-wrapper-init
    >
      {/* TODO: extract showPassword logic to a different component that encapsulates TextField and adds the icon and functionality on top */}
      <input
        type={showPassword ? 'text' : type}
        className={`peer block min-h-[auto] rounded-lg border-none bg-transparent py-3 px-4 text-lg outline outline-1 transition-all duration-200 ease-linear motion-reduce:transition-none ${inputClassName} ${
          error
            ? 'text-red outline-red focus:outline-red'
            : 'outline-light-gray focus:outline-turquoise'
        }`}
        onChange={(e) => setContent(e.target.value)}
        name={name}
        {...props}
      />
      {type === 'password' && (
        <div
          className="absolute right-3 top-4 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOffIcon className="h-5 w-5 text-gray" />
          ) : (
            <EyeIcon className="h-5 w-5 text-gray" />
          )}
        </div>
      )}

      <label
        onSelectCapture={(e) => e.preventDefault()} // Prevents context menu from opening when selecting text
        htmlFor={fieldName}
        className={`pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate bg-transparent px-1.5 pt-3 transition-all duration-200 ease-out peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:bg-white ${
          error
            ? 'text-red peer-focus:text-red'
            : 'text-light-gray peer-focus:text-turquoise'
        } ${
          content === '' ? '' : '-translate-y-5 scale-75 bg-white'
        }  motion-reduce:transition-none`}
      >
        {fieldName}
      </label>
      {error && (
        <div className="mt-1 text-xs font-medium text-red">{error}</div>
      )}
    </div>
  );
}
