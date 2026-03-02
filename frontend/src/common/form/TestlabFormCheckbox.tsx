import { TestlabInputBaseProps } from '@common/form/TestlabFormInput';
import TestlabFormRequiredLabel from '@common/form/TestlabFormRequiredLabel';
import { getErrorMessage } from '@common/form/util';
import { Checkbox, Fieldset } from '@digdir/designsystemet-react';
import { Controller, useFormContext } from 'react-hook-form';

export type Props<T extends object> = TestlabInputBaseProps<T> &{
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
          <Fieldset>
            <Fieldset.Legend>
              <TestlabFormRequiredLabel label={label} required={required} />
            </Fieldset.Legend>
           <Fieldset.Description>
             {description}
           </Fieldset.Description>
            <Checkbox
              onChange={() => onChange(!value)}
              checked={value === true}
              value={checkboxLabel}
              label={checkboxLabel}
              onBlur={onBlur}
              error={errorMessage}
              disabled={disabled}
            />
          </Fieldset>
        </div>
      )}
    />
  );
};

export default TestlabFormCheckbox;
