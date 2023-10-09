import './debounced-input.scss';

import { Textfield } from '@digdir/design-system-react';
import React, { useEffect, useState } from 'react';

export type Props = {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
  label?: string;
  ariaLabel?: string;
};

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  label,
  ariaLabel,
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
    <div className="debounced-input__container">
      <Textfield
        label={label}
        type="text"
        value={String(value)}
        onChange={(e) => setValue(e.target.value)}
        aria-label={ariaLabel}
      />
    </div>
  );
};

export default DebouncedInput;
