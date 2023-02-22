import React from 'react';
import { Form, FormControl } from 'react-bootstrap';
import Feedback from 'react-bootstrap/Feedback';
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
        <Form.Group className="mb-3">
          <Form.Label>{label}</Form.Label>
          <FormControl
            value={field.value}
            isInvalid={hasError}
            {...register(name, formValidation?.validation)}
          />
          {hasError && formValidation?.errorMessage && (
            <Feedback type="invalid">{formValidation?.errorMessage}</Feedback>
          )}
        </Form.Group>
      )}
    />
  );
};

export default TestlabFormInput;
