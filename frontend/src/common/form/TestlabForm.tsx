import './TestlabForm.scss';

import React, { ReactNode } from 'react';
import { FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';

import TestlabFormButtons from './TestlabFormButtons';
import TestlabFormInput from './TestlabFormInput';
import TestlabFormSelect from './TestlabFormSelect';

export interface TestlabFormProps<T extends object> {
  heading: string;
  subHeading?: string;
  onSubmit: SubmitHandler<T>;
  formMethods: UseFormReturn<T>;
  children: ReactNode;
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

/**
 * React component for a generic form, wrapped in a form provider from 'react-hook-form'.
 * @template T - Type for form data.
 * @param {TestlabFormProps<T>} props - Props for the TestlabForm component.
 * @param {string} props.heading - Main heading for the form.
 * @param {string} [props.subHeading] - Sub-heading for the form, optional.
 * @param {SubmitHandler<T>} props.onSubmit - Submit handler function for the form.
 * @param {UseFormReturn<T>} props.formMethods - React hook form methods for the form.
 * @param {ReactNode} props.children - React children to render within the form.
 * @return {JSX.Element} The React component for the TestlabForm.
 */
const TestlabForm = <T extends object>({
  heading,
  subHeading,
  children,
  formMethods,
  onSubmit,
}: TestlabFormProps<T>) => {
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
