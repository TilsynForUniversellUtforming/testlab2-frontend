import './TestlabForm.scss';

import React, { ReactNode } from 'react';
import { Form } from 'react-bootstrap';
import { FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';

import TestlabFormButtons from './TestlabFormButtons';
import TestlabFormInput from './TestlabFormInput';
import TestlabFormSelect from './TestlabFormSelect';

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

const TestlabForm = <T extends object>({
  label,
  children,
  formMethods,
  onSubmit,
}: Props<T>) => {
  const { handleSubmit } = formMethods;

  return (
    <>
      {label && <h3 className="mb-4">{label}</h3>}
      <FormProvider {...formMethods}>
        <Form className="mb-4 testlab-form" onSubmit={handleSubmit(onSubmit)}>
          {children}
        </Form>
      </FormProvider>
    </>
  );
};

TestlabForm.FormInput = TestlabFormInput;
TestlabForm.FormSelect = TestlabFormSelect;
TestlabForm.FormButtons = TestlabFormButtons;

export default TestlabForm;
