import { ErrorMessage, TextField } from '@digdir/design-system-react';
import React from 'react';
import { Controller, Path, useFormContext } from 'react-hook-form';

import { FormValidation } from './types';

export interface EditProps<T extends object> {
  label: string;
  sublabel?: string;
  formValidation?: FormValidation;
  hidden?: boolean;
  name: Path<T>;
  numeric?: boolean;
  disabled?: boolean;
}

const TestlabFormInput = <T extends object>({
  label,
  sublabel,
  name,
  formValidation,
  numeric = false,
}: EditProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();
  const error = errors as any;
  const hasError = !!error[name];

  return (
    <Controller
      name={name}
      control={control}
      rules={formValidation?.validation}
      render={({ field: { onChange, onBlur, value } }) => (
        <div className="testlab-form__input">
          <label htmlFor={name} className="testlab-form__input-label">
            {label}
            {formValidation?.validation?.required && <>*</>}
            {sublabel && (
              <div className="testlab-form__input-sub-label">{sublabel}</div>
            )}
          </label>
          <TextField
            type="text"
            value={value}
            id={name}
            isValid={!hasError}
            onChange={onChange}
            onBlur={onBlur}
            name={name}
            inputMode={numeric ? 'numeric' : 'text'}
          />
          {hasError && formValidation?.errorMessage && (
            <ErrorMessage size="small">
              {formValidation?.errorMessage}
            </ErrorMessage>
          )}
        </div>
      )}
    />
  );
};

export default TestlabFormInput;
