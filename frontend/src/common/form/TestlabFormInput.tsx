import { ErrorMessage, TextField } from '@digdir/design-system-react';
import React from 'react';
import { Controller, Path, useFormContext } from 'react-hook-form';

import { FormValidation } from './types';

export interface EditProps<T extends object> {
  label: string;
  formValidation?: FormValidation;
  hidden?: boolean;
  name: Path<T>;
}

const TestlabFormInput = <T extends object>({
  label,
  name,
  formValidation,
}: EditProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const hasError = !!errors[name];

  return (
    <Controller
      name={name}
      control={control}
      rules={formValidation?.validation}
      render={({ field: { onChange, onBlur, value } }) => (
        <>
          <TextField
            type="text"
            value={value}
            label={label}
            isValid={!hasError}
            onChange={onChange}
            onBlur={onBlur}
            name={name}
          />
          {hasError && formValidation?.errorMessage && (
            <ErrorMessage>{formValidation?.errorMessage}</ErrorMessage>
          )}
        </>
      )}
    />
  );
};

export default TestlabFormInput;
