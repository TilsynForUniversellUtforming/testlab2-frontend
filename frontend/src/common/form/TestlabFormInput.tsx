import { getErrorMessage } from '@common/form/util';
import {Textfield, TextfieldProps } from '@digdir/designsystemet-react';
import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { Path, useFormContext } from 'react-hook-form';
import { Size } from '@digdir/designsystemet-types';

export type TestlabInputBaseProps<T extends object>
  = TextfieldProps & {
  label: string;
  required?: boolean;
  hidden?: boolean;
  name: Path<T>;
  disabled?: boolean;
  size?:Size
  type?: TextfieldProps['type'];
}

/**
 * A form input component integrated with react-hook-form, supporting text and numeric input.
 *
 * @template T - The type of the form data object.
 * @param {TestlabInputBaseProps<T>} props - The props for the component.
 * @param {string} props.label - Label for the input field.
 * @param {string} [props.description] - Optional description for the input field.
 * @param {Path<T>} props.name - The name of the input field, correlating to the property in form data.
 * @param {boolean} [props.required=false] - Indicates if the input is required.
 * @param {boolean} [props.numeric=false] - If true, the input type will be numeric.
 * @param {string} [props.size='small'] - Size of the input field.
 * @param {TextfieldProps} rest - Other textarea props
 * @returns {ReactNode}
 */
const TestlabFormInput = <T extends object>({
  label,
  description,
  name,
  required = false,
  size = 'sm',
  type,
  ...rest
}: TestlabInputBaseProps<T>): ReactNode => {
  const { register, formState } = useFormContext<T>();
  const errorMessage = getErrorMessage(formState, name);

  const type = rest.type;


  return (
    <div
      className={classNames('testlab-form__input', {
        date: type === 'date',
      })}
    >

      <Textfield
        id={name}
        error={errorMessage}
        data-size={size}
        label={label}
        type={type}
        {...register(name, {
          required: required,
        })}
        {...rest}
      />
    </div>
  );
};

export default TestlabFormInput;
