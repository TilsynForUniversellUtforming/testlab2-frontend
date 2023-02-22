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

import { Option } from '../types';

export type StepType = 'Start' | 'Middle' | 'Submit';

export type Step = {
  stepType: StepType;
  onClickBack: () => void;
};

export interface Props<T extends object> {
  label?: string;
  onSubmit: SubmitHandler<T>;
  formMethods: UseFormReturn<T>;
  step: Step;
  children: ReactNode;
}

export interface FormValidation {
  validation: RegisterOptions;
  errorMessage: string;
}
export interface EditProps<T extends object> {
  label: string;
  formValidation?: FormValidation;
  hidden?: boolean;
  name: Path<T>;
}

export interface EditSelectProps<T extends object> extends EditProps<T> {
  options: Option[];
  multiple?: boolean;
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

const FormButtons = ({ stepType, onClickBack }: Step) => {
  switch (stepType) {
    case 'Start':
      return (
        <div className="mb-3">
          <Button variant="secondary" className="me-3" onClick={onClickBack}>
            Avbryt
          </Button>
          <Button type="submit">Neste</Button>
        </div>
      );
    case 'Middle':
      return (
        <div className="mb-3">
          <Button variant="secondary" className="me-3" onClick={onClickBack}>
            Tilbake
          </Button>
          <Button type="submit">Neste</Button>
        </div>
      );
    case 'Submit':
      return (
        <div className="mb-3">
          <Button variant="secondary" className="me-3" onClick={onClickBack}>
            Tilbake
          </Button>
          <Button type="submit">Lagre</Button>
        </div>
      );
    default:
      throw new Error('Ulovlig tilstand');
  }
};

const TestlabForm = <T extends object>({
  label,
  children,
  formMethods,
  step,
  onSubmit,
}: Props<T>) => {
  const { handleSubmit } = formMethods;

  return (
    <>
      {label && <h3 className="mb-4">{label}</h3>}
      <FormProvider {...formMethods}>
        <Form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
          <FormButtons
            stepType={step.stepType}
            onClickBack={step.onClickBack}
          />
          {children}
        </Form>
      </FormProvider>
    </>
  );
};

TestlabForm.FormInput = FormInput;
TestlabForm.FormSelect = FormSelect;

export default TestlabForm;
