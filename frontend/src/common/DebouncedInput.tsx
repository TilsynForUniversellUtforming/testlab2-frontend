import { TextField } from '@digdir/design-system-react';
import React, { InputHTMLAttributes, useEffect, useState } from 'react';

export type Props = {
  value: string | number;
  placeholder: string;
  onChange: (value: string | number) => void;
  debounce?: number;
  label?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>;

const DebouncedInput = ({
  value: initialValue,
  placeholder,
  onChange,
  debounce = 500,
  label,
}: Props) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <TextField
      label={label}
      type="text"
      placeholder={placeholder}
      value={String(value)}
      onChange={(e) => setValue(e.target.value)}
      name="debounced-input"
      autoComplete="new-password"
    />
  );
};

export default DebouncedInput;
