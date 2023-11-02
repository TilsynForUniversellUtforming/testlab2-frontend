import './field-array.scss';

import TestlabFormAutocomplete, {
  AutoCompleteProps,
} from '@common/form/autocomplete/TestlabFormAutocomplete';
import { ButtonSize, ButtonVariant } from '@common/types';
import { Button, ErrorMessage } from '@digdir/design-system-react';
import { MinusCircleIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { useCallback } from 'react';
import {
  ArrayPath,
  FieldArray,
  FieldArrayWithId,
  Path,
  PathValue,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';

interface Props<
  FormDataType extends object,
  ResultDataType extends PathValue<FormDataType, Path<FormDataType>>,
> {
  fieldName: ArrayPath<FormDataType>;
  defaultValues: FieldArray<FormDataType, ArrayPath<FormDataType>>;
  autocompleteProps: AutoCompleteProps<FormDataType, ResultDataType>;
  errorMessageForm?: string;
  buttonAddText?: string;
  buttonRemoveText?: string;
}

const TestlabFormFieldArray = <
  FormDataType extends object,
  ResultDataType extends PathValue<FormDataType, Path<FormDataType>>,
>({
  fieldName,
  defaultValues,
  errorMessageForm,
  autocompleteProps,
  buttonAddText = 'Legg til',
  buttonRemoveText = 'Fjern',
}: Props<FormDataType, ResultDataType>) => {
  const { control, clearErrors } = useFormContext<FormDataType>();
  const { fields, append, remove, insert } = useFieldArray({
    name: fieldName,
    control,
  });

  const {
    label,
    resultList,
    resultLabelKey,
    resultDescriptionKey,
    onChange,
    name,
    retainSelection,
    required,
    spacing,
    errorMessage,
  } = autocompleteProps;

  const onClick = useCallback((value: ResultDataType, idx: number) => {
    insert(idx, value);
    remove(idx + 1);
    clearErrors();
  }, []);

  return (
    <div className="testlab-form__field-array">
      {fields.map((field, idx) => {
        const valueLabel = String(
          field[
            resultLabelKey as keyof FieldArrayWithId<
              FormDataType,
              ArrayPath<FormDataType>,
              'id'
            >
          ]
        ); // TODO - better label type

        return (
          <div className="testlab-form__field-array-entry" key={field.id}>
            {valueLabel}
            {!valueLabel && (
              <div className="testlab-form__field-array-entry__input">
                <TestlabFormAutocomplete<FormDataType, ResultDataType>
                  label={label}
                  resultList={resultList}
                  resultLabelKey={resultLabelKey}
                  resultDescriptionKey={resultDescriptionKey}
                  onChange={onChange}
                  onClick={(value) => onClick(value, idx)}
                  name={name}
                  retainSelection={retainSelection}
                  required={required}
                  spacing={spacing}
                  errorMessage={errorMessage}
                />
              </div>
            )}
            <Button
              size={ButtonSize.Small}
              variant={ButtonVariant.Quiet}
              type="button"
              onClick={() => remove(idx)}
              icon={<MinusCircleIcon />}
            >
              {buttonRemoveText}
            </Button>
          </div>
        );
      })}
      <Button
        size={ButtonSize.Small}
        variant={ButtonVariant.Quiet}
        type="button"
        onClick={() => append(defaultValues)}
        icon={<PlusCircleIcon />}
      >
        {buttonAddText}
      </Button>
      {errorMessageForm && (
        <ErrorMessage size="small">{errorMessageForm}</ErrorMessage>
      )}
    </div>
  );
};

export default TestlabFormFieldArray;
