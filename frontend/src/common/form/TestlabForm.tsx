import './TestlabForm.scss';

import { Paragraph } from '@digdir/designsystemet-react';
import classnames from 'classnames';
import React, { ReactElement, ReactNode } from 'react';
import { FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';

import TestlabFormButtons from './TestlabFormButtons';
import TestlabFormHeader from './TestlabFormHeader';
import TestlabFormInput from './TestlabFormInput';
import TestlabFormSelect from './TestlabFormSelect';

export interface TestlabFormProps<
  T extends object,
  TTransformed extends object = T,
> {
  heading?: string;
  description?: string;
  onSubmit: SubmitHandler<TTransformed>;
  formMethods: UseFormReturn<T, unknown, TTransformed>;
  hasRequiredFields?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * React component for a generic form, wrapped in a form provider from 'react-hook-form'.
 * @template T - Type for raw form field values (as entered by the user).
 * @template TTransformed - Type for the validated/transformed values passed to onSubmit. Defaults to T.
 * @param {TestlabFormProps<T, TTransformed>} props - Props for the TestlabForm component.
 * @param {string} props.heading - Main heading for the form.
 * @param {string} [props.description] - Description for the form, optional.
 * @param {SubmitHandler<TTransformed>} props.onSubmit - Submit handler function for the form.
 * @param {UseFormReturn<T, unknown, TTransformed>} props.formMethods - React hook form methods for the form.
 * @param {ReactNode} props.children - React children to render within the form.
 * @param {boolean} props.hasRequiredFields - For displaying info about fields being required. Default to true.
 * @param {string} className - Optional field for custom classes
 * @return {ReactElement} The React component for the TestlabForm.
 */
const TestlabForm = <T extends object, TTransformed extends object = T>({
  heading,
  description,
  children,
  formMethods,
  onSubmit,
  hasRequiredFields = true,
  className,
}: TestlabFormProps<T, TTransformed>): ReactElement => {
  const { handleSubmit } = formMethods;

  return (
    <FormProvider
      {...formMethods}
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
          <Paragraph data-size="sm">
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
