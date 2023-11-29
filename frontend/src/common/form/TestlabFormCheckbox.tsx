import { TestlabInputBaseProps } from '@common/form/TestlabFormInput';
import TestlabFormRequiredLabel from '@common/form/TestlabFormRequiredLabel';
import { getErrorMessage } from '@common/form/util';
import { Checkbox } from '@digdir/design-system-react';
import { Controller, useFormContext } from 'react-hook-form';

export interface Props<T extends object> extends TestlabInputBaseProps<T> {
  checkboxLabel: string;
}

const TestlabFormCheckbox = <T extends object>({
  label,
  description,
  name,
  required = false,
  disabled,
  size,
  checkboxLabel,
}: Props<T>) => {
  const { control, formState } = useFormContext<T>();
  const errorMessage = getErrorMessage(formState, name);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, onBlur } }) => (
        <div className="testlab-form__select">
          <Checkbox.Group
            legend={
              <TestlabFormRequiredLabel label={label} required={required} />
            }
            description={description}
            size={size}
            error={errorMessage}
            disabled={disabled}
          >
            <Checkbox
              onChange={() => onChange(!value)}
              checked={value === true}
              value={checkboxLabel}
              onBlur={onBlur}
            >
              {checkboxLabel}
            </Checkbox>
          </Checkbox.Group>
        </div>
      )}
    />
  );
};

export default TestlabFormCheckbox;
