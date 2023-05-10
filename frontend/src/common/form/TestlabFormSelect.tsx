import { ErrorMessage, Select } from '@digdir/design-system-react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Option } from '../types';
import { EditProps } from './TestlabFormInput';

export interface EditSelectProps<T extends object> extends EditProps<T> {
  options: Option[];
}

const TestlabFormSelect = <T extends object>({
  label,
  sublabel,
  options,
  name,
  formValidation,
}: EditSelectProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();
  const error = errors as any;
  const hasError = !!error[name];

  return (
    <Controller
      name={name}
      control={control}
      rules={formValidation?.validation}
      render={({ field: { onChange, value } }) => (
        <div className="testlab-form__select">
          <label htmlFor={name} className="testlab-form__input-label">
            {label}
            {sublabel && (
              <div className="testlab-form__input-sub-label">{sublabel}</div>
            )}
          </label>
          <Select
            inputId={name}
            value={value}
            onChange={onChange}
            options={options}
            error={hasError}
          />
          {hasError && formValidation?.errorMessage && (
            <ErrorMessage>{formValidation?.errorMessage}</ErrorMessage>
          )}
        </div>
      )}
    />
  );
};

export default TestlabFormSelect;
