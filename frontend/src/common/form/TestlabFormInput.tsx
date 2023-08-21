import { getErrorMessage } from '@common/form/util';
import { ErrorMessage, TextField } from '@digdir/design-system-react';
import React from 'react';
import { Controller, Path, useFormContext } from 'react-hook-form';

export interface EditProps<T extends object> {
  label: string;
  sublabel?: string;
  required?: boolean;
  hidden?: boolean;
  name: Path<T>;
  numeric?: boolean;
  disabled?: boolean;
}

const TestlabFormInput = <T extends object>({
  label,
  sublabel,
  name,
  required = false,
  numeric = false,
}: EditProps<T>) => {
  const { control, formState } = useFormContext<T>();
  const errorMessage = getErrorMessage(formState, name);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <div className="testlab-form__input">
          <label htmlFor={name} className="testlab-form__input-label">
            {label}
            {required && <span className="asterisk-color">*</span>}
            {sublabel && (
              <div className="testlab-form__input-sub-label">{sublabel}</div>
            )}
          </label>
          <TextField
            type={numeric ? 'number' : 'text'}
            value={value}
            id={name}
            isValid={!errorMessage}
            onChange={onChange}
            onBlur={onBlur}
            name={name}
            inputMode={numeric ? 'numeric' : 'text'}
          />
          {errorMessage && (
            <ErrorMessage size="small">{errorMessage}</ErrorMessage>
          )}
        </div>
      )}
    />
  );
};

export default TestlabFormInput;
