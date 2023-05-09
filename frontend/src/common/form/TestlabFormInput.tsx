import { ErrorMessage, TextField } from '@digdir/design-system-react';
import React from 'react';
import { Controller, Path, useFormContext } from 'react-hook-form';

import { FormValidation } from './types';

export interface EditProps<T extends object> {
  label: string;
  formValidation?: FormValidation;
  hidden?: boolean;
  name: Path<T>;
  numeric?: boolean;
}

const TestlabFormInput = <T extends object>({
  label,
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
          <TextField
            type="text"
            value={value}
            label={label}
            isValid={!hasError}
            onChange={onChange}
            onBlur={onBlur}
            name={name}
            inputMode={numeric ? 'numeric' : 'text'}
          />
          {hasError && formValidation?.errorMessage && (
            <ErrorMessage>{formValidation?.errorMessage}</ErrorMessage>
          )}
        </div>
      )}
    />
  );
};

export default TestlabFormInput;
