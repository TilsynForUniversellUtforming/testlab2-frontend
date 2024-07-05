import { Label, Textarea, TextareaProps } from '@digdir/designsystemet-react';
import React, { ReactNode } from 'react';
import { Path, useFormContext } from 'react-hook-form';

import { getErrorMessage } from './util';

export interface TestlabInputBaseProps<T extends object> extends TextareaProps {
  label: string;
  required?: boolean;
  hidden?: boolean;
  name: Path<T>;
  numeric?: boolean;
  disabled?: boolean;
  textarea?: boolean;
}

/**
 * A form text area input component integrated with react-hook-form, supporting text and numeric input.
 *
 * @template T - The type of the form data object.
 * @param {TestlabInputBaseProps<T>} props - The props for the component.
 * @param {string} props.label - Label for the input field.
 * @param {string} [props.description] - Optional description for the input field.
 * @param {Path<T>} props.name - The name of the input field, correlating to the property in form data.
 * @param {boolean} [props.required=false] - Indicates if the input is required.
 * @param {string} [props.size='small'] - Size of the input field.
 * @param {TextareaProps} rest - Other textarea props
 * @returns {ReactNode}
 */
const TestlabFormTextArea = <T extends object>({
  label,
  description,
  name,
  required = false,
  size = 'small',
  inputMode,
  ...rest
}: TestlabInputBaseProps<T>): ReactNode => {
  const { register, formState } = useFormContext<T>();
  const errorMessage = getErrorMessage(formState, name);

  return (
    <div className="testlab-form__input">
      <Label htmlFor={name} className="testlab-form__input-label">
        {label}
        {required && <span className="asterisk-color">*</span>}
        {description && (
          <div className="testlab-form__input-sub-label">{description}</div>
        )}
      </Label>
      <Textarea
        id={name}
        {...register(name, {
          required: required,
        })}
        {...rest}
        error={errorMessage}
        inputMode={inputMode}
        size={size}
      />
    </div>
  );
};

export default TestlabFormTextArea;
