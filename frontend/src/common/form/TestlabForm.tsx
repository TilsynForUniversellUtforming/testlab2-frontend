import './TestlabForm.scss';

import React, { ReactNode } from 'react';
import { FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';

import TestlabFormButtons from './TestlabFormButtons';
import TestlabFormHeader from './TestlabFormHeader';
import TestlabFormInput from './TestlabFormInput';
import TestlabFormSelect from './TestlabFormSelect';

export interface TestlabFormProps<T extends object> {
  heading?: string;
  subHeading?: string;
  onSubmit: SubmitHandler<T>;
  formMethods: UseFormReturn<T>;
  children: ReactNode;
}

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
    <FormProvider
      watch={formMethods.watch}
      getValues={formMethods.getValues}
      getFieldState={formMethods.getFieldState}
      setError={formMethods.setError}
      clearErrors={formMethods.clearErrors}
      setValue={formMethods.setValue}
      trigger={formMethods.trigger}
      formState={formMethods.formState}
      resetField={formMethods.resetField}
      reset={formMethods.reset}
      handleSubmit={formMethods.handleSubmit}
      unregister={formMethods.unregister}
      control={formMethods.control}
      register={formMethods.register}
      setFocus={formMethods.setFocus}
    >
      <form className="testlab-form" onSubmit={handleSubmit(onSubmit)}>
        {heading && (
          <TestlabFormHeader heading={heading} subHeading={subHeading} />
        )}
        {children}
      </form>
    </FormProvider>
  );
};

TestlabForm.FormInput = TestlabFormInput;
TestlabForm.FormSelect = TestlabFormSelect;
TestlabForm.FormButtons = TestlabFormButtons;

export default TestlabForm;
