import CurrencyInput from 'react-currency-input-field';
import cn from 'classnames';
import { useEffect, useState } from 'react';

export default function MoneyInput({
  className = '',
  onValueChange,
  max = 1000, // max amount of € allowed to enter
  maxLength = 6, // max number of characters in the input (counting decimals)
  defaultValue = 0,
  error = '', // in case it comes from outside
  setHasErrors = null, // to optionally set the hasErrors state in the outside component
  ...props
}) {
  const [value, setValue] = useState(defaultValue.toString());
  const valueNum = parseFloat(value?.replaceAll(',', '.'));

  // validators depending on the props
  error =
    error || (max && valueNum > max ? 'El importe es demasiado alto' : '');
  error =
    error ||
    (maxLength && defaultValue.toString().length > maxLength - 1
      ? 'El importe es demasiado alto'
      : '');
  error = error || (valueNum < 0 ? 'El importe no puede ser negativo' : '');
  error = error || (valueNum === 0 ? 'El importe no puede ser 0' : '');
  error = error || (valueNum === null ? 'El importe no puede estar vacío' : '');
  error =
    error || (valueNum === undefined ? 'El importe no puede estar vacío' : '');

  useEffect(() => {
    if (setHasErrors !== null) setHasErrors(error !== '');
  }, [error]);

  return (
    <>
      <CurrencyInput
        intlConfig={{ locale: 'es-ES', currency: 'EUR' }}
        placeholder="0,00€"
        className={cn(
          {
            'text-red outline-red focus:outline-red-dark': error,
          },
          className
        )}
        onValueChange={(value) => {
          setValue(value);
          onValueChange(value);
        }}
        decimalsLimit={2}
        defaultValue={defaultValue}
        max={max}
        maxLength={maxLength}
        allowNegativeValue={false}
        {...props}
      />
      {error && <span className="text-sm text-red">{error}</span>}
    </>
  );
}
