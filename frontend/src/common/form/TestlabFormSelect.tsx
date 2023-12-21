import TestlabFormRequiredLabel, {
  TestlabFormLabel,
} from '@common/form/TestlabFormRequiredLabel';
import { getErrorMessage } from '@common/form/util';
import { Combobox, Radio } from '@digdir/design-system-react';
import React, { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { OptionType } from '../types';
import { TestlabInputBaseProps } from './TestlabFormInput';

export interface TestlabInputSelectProps<T extends object>
  extends TestlabInputBaseProps<T> {
  options: OptionType[];
  radio?: boolean;
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
  size,
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
              value={value}
              size={size}
              disabled={disabled}
            >
              {options.map((option) => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
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
          <TestlabFormLabel
            htmlFor={name}
            label={label}
            required={required}
            description={description}
          />
          <Combobox
            id={name}
            name={name}
            value={value}
            onValueChange={onChange}
            error={errorMessage}
            disabled={disabled}
            label={label}
            size="small"
            hideLabel
          >
            {options.map(({ label, value }) => (
              <Combobox.Option value={value} key={value}>
                {label}
              </Combobox.Option>
            ))}
          </Combobox>
        </div>
      )}
    />
  );
};

export default TestlabFormSelect;
