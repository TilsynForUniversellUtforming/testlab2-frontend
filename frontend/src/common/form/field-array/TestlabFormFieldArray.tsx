import './field-array.scss';

import { AutoCompleteProps } from '@common/form/autocomplete/TestlabFormAutocomplete';
import { TestlabInputBaseProps } from '@common/form/TestlabFormInput';
import { TestlabInputSelectProps } from '@common/form/TestlabFormSelect';
import { ButtonSize, ButtonVariant } from '@common/types';
import { Button } from '@digdir/design-system-react';
import { ReactElement } from 'react';
import {
  ArrayPath,
  FieldArray,
  Path,
  PathValue,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';

interface Props<FormData extends object> {
  fieldName: ArrayPath<FormData>;
  defaultValues: FieldArray<FormData, ArrayPath<FormData>>;
  children: ReactElement<
    | TestlabInputBaseProps<FormData>
    | TestlabInputSelectProps<FormData>
    | AutoCompleteProps<FormData, PathValue<FormData, Path<FormData>>>
  >;
}

const TestlabFormFieldArray = <FormData extends object>({
  fieldName,
  defaultValues,
  children,
}: Props<FormData>) => {
  const { control } = useFormContext<FormData>();

  const { fields, append, remove } = useFieldArray({
    name: fieldName,
    control,
  });

  return (
    <div className="testlab-form__field-array">
      {fields.map((field, index) => {
        return (
          <div className="testlab-form__field-array-entry" key={field.id}>
            {children}
            <Button
              size={ButtonSize.Small}
              variant={ButtonVariant.Quiet}
              type="button"
              onClick={() => remove(index)}
            >
              Fjern
            </Button>
          </div>
        );
      })}
      <Button
        size={ButtonSize.Small}
        variant={ButtonVariant.Quiet}
        type="button"
        onClick={() => append(defaultValues)}
      >
        Legg til
      </Button>
    </div>
  );
};

export default TestlabFormFieldArray;
