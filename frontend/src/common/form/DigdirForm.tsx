import React, { ReactNode } from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';
import Feedback from 'react-bootstrap/Feedback';
import {
  Controller,
  FormProvider,
  Path,
  SubmitHandler,
  useFormContext,
  UseFormReturn,
} from 'react-hook-form';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';
import { useNavigate } from 'react-router-dom';

import { Option } from '../types';

export interface Props<T extends object> {
  label?: string;
  onSubmit: SubmitHandler<T>;
  formMethods: UseFormReturn<T>;
  children: ReactNode;
}

export interface FormValidation {
  validation: RegisterOptions;
  errorMessage: string;
}
export interface EditProps<T extends object> {
  label: string;
  formValidation?: FormValidation;
  name: Path<T>;
}

export interface EditSelectProps<T extends object> extends EditProps<T> {
  options: Option[];
}

const FormInput = <T extends object>({
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

const FormSelect = <T extends object>({
  label,
  options,
  name,
  formValidation,
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
            {...register(name, formValidation?.validation)}
          >
            {options.map((option) => (
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

const DigdirForm = <T extends object>({
  label,
  children,
  formMethods,
  onSubmit,
}: Props<T>) => {
  const navigate = useNavigate();
  const { handleSubmit } = formMethods;

  return (
    <>
      {label && <h3 className="mb-4">{label}</h3>}
      <FormProvider {...formMethods}>
        <Form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
          {children}
          <Button
            variant="secondary"
            className="me-3"
            onClick={() => navigate('..')}
          >
            Tilbake
          </Button>
          <Button type="submit">Lagre</Button>
        </Form>
      </FormProvider>
    </>
  );
};

DigdirForm.FormInput = FormInput;
DigdirForm.FormSelect = FormSelect;

export default DigdirForm;
