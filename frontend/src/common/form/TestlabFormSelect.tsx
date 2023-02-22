import React from 'react';
import { Form } from 'react-bootstrap';
import Feedback from 'react-bootstrap/Feedback';
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
        <Form.Group className="mb-3">
          <Form.Label column htmlFor={label} className="p-0">
            {label}
          </Form.Label>
          <Form.Select
            aria-label={label}
            id={label}
            value={field.value}
            isInvalid={hasError}
            multiple={multiple}
            {...register(name, formValidation?.validation)}
          >
            {options.map((option: Option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
          {hasError && formValidation?.errorMessage && (
            <Feedback type="invalid">{formValidation?.errorMessage}</Feedback>
          )}
        </Form.Group>
      )}
    />
  );
};

export default TestlabFormSelect;
