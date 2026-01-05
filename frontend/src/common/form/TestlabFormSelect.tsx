import TestlabFormRequiredLabel from '@common/form/TestlabFormRequiredLabel';
import { getErrorMessage } from '@common/form/util';
import { isDefined } from '@common/util/validationUtils';
import {
  ErrorSummary,
  Fieldset,
  Label,
  Radio,
  useRadioGroup, ValidationMessage, EXPERIMENTAL_Suggestion as Suggestion,
} from '@digdir/designsystemet-react';
import React, { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { OptionType } from '../types';
import { TestlabInputBaseProps } from './TestlabFormInput';

export type TestlabInputSelectProps<T extends object> =
   TestlabInputBaseProps<T> & {
  options: OptionType[];
  radio?: boolean;
  radioInline?: boolean;
  description: string;
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
    const { getRadioProps, validationMessageProps } = useRadioGroup()
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { value } }) => (
          <div className="testlab-form__select">
            <Fieldset>
              <Fieldset.Legend>
                <TestlabFormRequiredLabel label={label} required={required} />
              </Fieldset.Legend>
              <Fieldset.Description>{description}</Fieldset.Description>
              {options.map(({ label, value }) => (
                <Radio label={label} {...getRadioProps(value)} />
              ))}
              <ValidationMessage {...validationMessageProps} />
            </Fieldset>
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
          <SuggestionRoot
            multiple
          >
            <Suggestion.Input data-size={size} />
            <Suggestion.ClearButton />
            <Suggestion.List>
            {options.map((o) => (
              <Suggestion.Option value={o.value} key={`${o.label}_${o.value}`}>
                {o.label}
              </Suggestion.Option>
            ))}
            </Suggestion.List>
          </SuggestionRoot>
          {errorMessage && (
            <ErrorSummary data-size="sm">{errorMessage}</ErrorSummary>
          )}
        </div>
      )}
    />
  );
};

export default TestlabFormSelect;
