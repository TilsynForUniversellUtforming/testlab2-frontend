import './debounced-input.scss';

import { Textfield, TextfieldProps } from '@digdir/design-system-react';
import React, { useEffect, useState } from 'react';

export type Props = {
  value?: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  debounce?: number;
  ariaLabel?: string;
  id?: string;
  errorMessage?: string;
};

const DebouncedInput = ({
  value: initialValue,
  onChange,
  onFocus,
  debounce = 500,
  label,
  description,
  ariaLabel,
  id,
  errorMessage,
  size,
}: Props & Omit<TextfieldProps, 'onChange'>) => {
  const [value, setValue] = useState(initialValue || '');

  useEffect(() => {
    setValue(initialValue || '');
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
        id={id}
        label={label}
        description={description}
        type="text"
        value={String(value)}
        onChange={(e) => setValue(e.target.value)}
        onFocus={onFocus}
        aria-label={ariaLabel}
        error={errorMessage}
        size={size}
      />
    </div>
  );
};

export default DebouncedInput;
