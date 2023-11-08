import { getErrorMessage } from '@common/form/util';
import { Textfield, TextfieldProps } from '@digdir/design-system-react';
import React from 'react';
import { Controller, Path, useFormContext } from 'react-hook-form';

export interface TestlabInputBaseProps<T extends object>
  extends TextfieldProps {
  label: string;
  required?: boolean;
  hidden?: boolean;
  name: Path<T>;
  numeric?: boolean;
  disabled?: boolean;
}

const TestlabFormInput = <T extends object>({
  label,
  description,
  name,
  required = false,
  numeric = false,
  size = 'small',
}: TestlabInputBaseProps<T>) => {
  const { control, formState } = useFormContext<T>();
  const errorMessage = getErrorMessage(formState, name);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <div className="testlab-form__input">
          <label htmlFor={name} className="testlab-form__input-label">
            {label}
            {required && <span className="asterisk-color">*</span>}
            {description && (
              <div className="testlab-form__input-sub-label">{description}</div>
            )}
          </label>
          <Textfield
            type={numeric ? 'number' : 'text'}
            value={value || ''}
            id={name}
            error={errorMessage}
            onChange={onChange}
            onBlur={onBlur}
            name={name}
            inputMode={numeric ? 'numeric' : 'text'}
            size={size}
          />
        </div>
      )}
    />
  );
};

export default TestlabFormInput;
