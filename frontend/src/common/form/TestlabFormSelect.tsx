import { getErrorMessage } from '@common/form/util';
import { isDefined } from '@common/util/validationUtils';
import { ErrorMessage, Select } from '@digdir/design-system-react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Option } from '../types';
import { TestlabInputBaseProps } from './TestlabFormInput';

export interface TestlabInputSelectProps<T extends object>
  extends TestlabInputBaseProps<T> {
  options: Option[];
}

const TestlabFormSelect = <T extends object>({
  label,
  description,
  options,
  name,
  required = false,
  disabled,
}: TestlabInputSelectProps<T>) => {
  const { control, formState } = useFormContext<T>();
  const errorMessage = getErrorMessage(formState, name);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <div className="testlab-form__select">
          <label htmlFor={name} className="testlab-form__input-label">
            {label}
            {required && <span className="asterisk-color">*</span>}
            {description && (
              <div className="testlab-form__input-sub-label">{description}</div>
            )}
          </label>
          <Select
            inputId={name}
            value={value}
            onChange={onChange}
            options={options}
            error={isDefined(errorMessage)}
            disabled={disabled}
            label={label}
            hideLabel
          />
          {errorMessage && (
            <ErrorMessage size="small">{errorMessage}</ErrorMessage>
          )}
        </div>
      )}
    />
  );
};

export default TestlabFormSelect;
