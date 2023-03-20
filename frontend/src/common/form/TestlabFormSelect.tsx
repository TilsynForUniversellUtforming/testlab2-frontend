import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Option } from '../types';
import { EditProps } from './TestlabFormInput';

export interface EditSelectProps<T extends object> extends EditProps<T> {
  options: Option[];
  multiple?: boolean;
}

const TestlabFormSelect = <T extends object>({
  label,
  options,
  name,
  formValidation,
  multiple = false,
}: EditSelectProps<T>) => {
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
          <label htmlFor={label} className="p-0">
            {label}
          </label>
          <select
            aria-label={label}
            id={label}
            value={field.value}
            // isInvalid={hasError}
            multiple={multiple}
            {...register(name, formValidation?.validation)}
          >
            {options.map((option: Option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {hasError && formValidation?.errorMessage && (
            // type="invalid"
            <div>{formValidation?.errorMessage}</div>
          )}
        </div>
      )}
    />
  );
};

export default TestlabFormSelect;
