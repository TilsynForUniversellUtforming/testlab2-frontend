import './TestlabForm.scss';

import { Paragraph } from '@digdir/designsystemet-react';
import classnames from 'classnames';
import React, { ReactElement, ReactNode } from 'react';
import { FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';

import TestlabFormButtons from './TestlabFormButtons';
import TestlabFormHeader from './TestlabFormHeader';
import TestlabFormInput from './TestlabFormInput';
import TestlabFormSelect from './TestlabFormSelect';

export interface TestlabFormProps<T extends object> {
  heading?: string;
  description?: string;
  onSubmit: SubmitHandler<T>;
  formMethods: UseFormReturn<T>;
  hasRequiredFields?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * React component for a generic form, wrapped in a form provider from 'react-hook-form'.
 * @template T - Type for form data.
 * @param {TestlabFormProps<T>} props - Props for the TestlabForm component.
 * @param {string} props.heading - Main heading for the form.
 * @param {string} [props.description] - Description for the form, optional.
 * @param {SubmitHandler<T>} props.onSubmit - Submit handler function for the form.
 * @param {UseFormReturn<T>} props.formMethods - React hook form methods for the form.
 * @param {ReactNode} props.children - React children to render within the form.
 * @param {booelan} props.hasRequiredFields - For displaying info about fields being required. Default to true.
 * @param {string} className - Optional field for custom classes
 * @return {ReactElement} The React component for the TestlabForm.
 */
const TestlabForm = <T extends object>({
  heading,
  description,
  children,
  formMethods,
  onSubmit,
  hasRequiredFields = true,
  className,
}: TestlabFormProps<T>): ReactElement => {
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
      <form
        className={classnames('testlab-form', className)}
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        {heading && (
          <TestlabFormHeader heading={heading} description={description} />
        )}
        {hasRequiredFields && (
          <Paragraph spacing size="small">
            Felter markert med stjerne er obligatoriske
          </Paragraph>
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
