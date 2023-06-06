import './debounced-input.scss';

import { TextField } from '@digdir/design-system-react';
import React, { useEffect, useState } from 'react';

export type Props = {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
  label?: string;
  ariaLabel?: string;
  labelPlacement?: 'top' | 'left';
  id: string;
};

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  label,
  ariaLabel,
  labelPlacement = 'top',
  id,
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

  const labelTopPlacement = labelPlacement === 'top';

  return (
    <div className="debounced-input__container">
      {!labelTopPlacement && (
        <label className="debounced-input__label" htmlFor={id}>
          {label}
        </label>
      )}
      <TextField
        label={labelTopPlacement ? label : undefined}
        type="text"
        value={String(value)}
        onChange={(e) => setValue(e.target.value)}
        id={id}
        autoComplete="new-password"
        aria-label={ariaLabel}
      />
    </div>
  );
};

export default DebouncedInput;
