import React from 'react';
import { Controller, Path, useFormContext } from 'react-hook-form';

import { FormValidation } from './TestlabForm';

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
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const hasError = !!errors[name];

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="mb-3">
          <label htmlFor="input-el">{label}</label>
          <input
            id="input-el"
            type="text"
            value={field.value}
            // isInvalid={hasError}
            {...register(name, formValidation?.validation)}
          />
          {hasError && formValidation?.errorMessage && (
            // type="invalid"
            <div>{formValidation?.errorMessage}</div>
          )}
        </div>
      )}
    />
  );
};

export default TestlabFormInput;
