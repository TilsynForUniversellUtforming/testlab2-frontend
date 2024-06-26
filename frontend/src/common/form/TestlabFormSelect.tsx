import TestlabFormRequiredLabel from '@common/form/TestlabFormRequiredLabel';
import { getErrorMessage } from '@common/form/util';
import { isDefined } from '@common/util/validationUtils';
import { Combobox, ErrorMessage, Label, Radio, } from '@digdir/designsystemet-react';
import React, { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { OptionType } from '../types';
import { TestlabInputBaseProps } from './TestlabFormInput';

export interface TestlabInputSelectProps<T extends object>
  extends TestlabInputBaseProps<T> {
  options: OptionType[];
  radio?: boolean;
  radioInline?: boolean;
}

/**
 * A form select component integrated with react-hook-form, supporting text and numeric input.
 *
 * @template T - The type of the form data object.
 * @param {TestlabInputSelectProps<T>} props - The props for the component.
 * @param {string} props.label - Label for the select input.
 * @param {string} [props.description] - Optional description for the select input.
 * @param {OptionType[]} props.options - An array of options for the select input.
 * @param {string} props.name - The name of the input field, correlating to the property in form data.
 * @param {boolean} [props.required=false] - Indicates if the select input is required.
 * @param {boolean} [props.disabled] - Indicates if the select input is disabled.
 *
 * @returns {ReactNode}
 */
const TestlabFormSelect = <T extends object>({
  label,
  description,
  options,
  name,
  required = false,
  disabled,
  radio = false,
  radioInline = false,
  size,
  ...rest
}: TestlabInputSelectProps<T>): ReactNode => {
  const { control, formState } = useFormContext<T>();
  const errorMessage = getErrorMessage(formState, name);

  if (radio) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <div className="testlab-form__select">
            <Radio.Group
              legend={
                <TestlabFormRequiredLabel label={label} required={required} />
              }
              description={description}
              error={errorMessage}
              onChange={onChange}
              value={typeof value === 'undefined' ? undefined : String(value)}
              size={size}
              disabled={disabled}
              inline={radioInline}
            >
              {options.map(({ label, value, title, disabled }) => (
                <Radio
                  key={value}
                  value={value}
                  title={title}
                  disabled={disabled}
                >
                  {label}
                </Radio>
              ))}
            </Radio.Group>
          </div>
        )}
      />
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <div className="testlab-form__select">
          <Label htmlFor={name} className="testlab-form__input-label">
            {label}
            {required && <span className="asterisk-color">*</span>}
            {description && (
              <div className="testlab-form__input-sub-label">{description}</div>
            )}
          </Label>
          <Combobox
            {...rest}
            id={name}
            value={value ? [String(value)] : undefined}
            onValueChange={(value) => onChange(value[0])}
            error={isDefined(errorMessage)}
            disabled={disabled}
            label={label}
            hideLabel
          >
            {options.map((o) => (
              <Combobox.Option value={o.value} key={`${o.label}_${o.value}`}>
                {o.label}
              </Combobox.Option>
            ))}
          </Combobox>
          {errorMessage && (
            <ErrorMessage size="small">{errorMessage}</ErrorMessage>
          )}
        </div>
      )}
    />
  );
};

export default TestlabFormSelect;
