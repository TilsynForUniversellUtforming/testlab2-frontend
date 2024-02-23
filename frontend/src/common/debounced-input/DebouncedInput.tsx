import {
  Textarea,
  Textfield,
  TextfieldProps,
} from '@digdir/design-system-react';
import React, { useEffect, useState } from 'react';

export type Props = {
  value?: string;
  onChange: (value?: string) => void;
  debounce?: number;
  ariaLabel?: string;
  errorMessage?: string;
  textArea?: boolean;
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
  disabled,
  hideLabel,
  type = 'text',
  textArea = false,
}: Props & Omit<TextfieldProps, 'onChange'>) => {
  const [value, setValue] = useState<string>(initialValue ?? '');

  useEffect(() => {
    setValue(initialValue ?? '');
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  if (textArea) {
    return (
      <div className="debounced-input__container">
        <Textarea
          id={id}
          label={label}
          description={description}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label={ariaLabel}
          error={errorMessage}
          size={size}
          disabled={disabled}
          hideLabel={hideLabel}
        />
      </div>
    );
  }

  return (
    <div className="debounced-input__container">
      <Textfield
        id={id}
        label={label}
        description={description}
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={onFocus}
        aria-label={ariaLabel}
        error={errorMessage}
        size={size}
        disabled={disabled}
        hideLabel={hideLabel}
      />
    </div>
  );
};

export default DebouncedInput;
