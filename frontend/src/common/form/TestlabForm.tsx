import './TestlabForm.scss';

import React, { ReactNode } from 'react';
import { FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';

import TestlabFormButtons from './TestlabFormButtons';
import TestlabFormInput from './TestlabFormInput';
import TestlabFormSelect from './TestlabFormSelect';

export interface Props<T extends object> {
  heading: string;
  subHeading?: string;
  onSubmit: SubmitHandler<T>;
  formMethods: UseFormReturn<T>;
  children: ReactNode;
}

export interface FormValidation {
  validation: RegisterOptions;
  errorMessage: string;
}

const FormHeader = ({
  heading,
  subHeading,
}: {
  heading: string;
  subHeading?: string;
}) => {
  return (
    <header className="testlab-form__header">
      <h2 className="heading">{heading}</h2>
      {subHeading && (
        <p role="doc-subtitle" className="sub-heading">
          {subHeading}
        </p>
      )}
    </header>
  );
};

const TestlabForm = <T extends object>({
  heading,
  subHeading,
  children,
  formMethods,
  onSubmit,
}: Props<T>) => {
  const { handleSubmit } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <FormHeader heading={heading} subHeading={subHeading} />
      <form className="testlab-form" onSubmit={handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormProvider>
  );
};

TestlabForm.FormInput = TestlabFormInput;
TestlabForm.FormSelect = TestlabFormSelect;
TestlabForm.FormButtons = TestlabFormButtons;

export default TestlabForm;
