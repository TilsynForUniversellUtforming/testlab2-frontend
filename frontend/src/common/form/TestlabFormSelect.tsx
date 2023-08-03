import { isFormError } from '@common/form/util';
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
  disabled,
}: EditSelectProps<T>) => {
  const { control, formState } = useFormContext<T>();
  const hasError = isFormError(formState, name);

  return (
    <Controller
      name={name}
      control={control}
      rules={formValidation?.validation}
      render={({ field: { onChange, value } }) => (
        <div className="testlab-form__select">
          <label htmlFor={name} className="testlab-form__input-label">
            {label}
            {formValidation?.validation?.required && <>*</>}
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
            disabled={disabled}
          />
          {hasError && formValidation?.errorMessage && (
            <ErrorMessage size="small">
              {formValidation?.errorMessage}
            </ErrorMessage>
          )}
        </div>
      )}
    />
  );
};

export default TestlabFormSelect;
