import {
  Label,
  Textarea,
  TextareaProps,
  Textfield,
  TextfieldProps,
} from '@digdir/designsystemet-react';
import React, { useEffect, useState } from 'react';
import { Size } from '@digdir/designsystemet-types';

export type Props = {
  value?: string;
  onChange: (value?: string) => void;
  debounce?: number;
  ariaLabel?: TextareaProps["aria-label"];
  errorMessage?: string;
  textArea?: boolean;
  size?:Size;
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
        <Label>{label}</Label>
        <Textarea
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label={ariaLabel}
          data-size={size}
          disabled={disabled}
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
        onFocus={onFocus as React.FocusEventHandler<HTMLInputElement>}
        error={errorMessage}
        data-size={size}
        disabled={disabled}
      />
    </div>
  );
};

export default DebouncedInput;
