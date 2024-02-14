import './field-array.scss';

import ConditionalComponentContainer from '@common/ConditionalComponentContainer';
import TestlabFormAutocomplete, {
  AutoCompleteProps,
} from '@common/form/autocomplete/TestlabFormAutocomplete';
import { getLabelString } from '@common/form/autocomplete/util';
import { getErrorMessage } from '@common/form/util';
import { ButtonSize, ButtonVariant } from '@common/types';
import { isDefined, isNotDefined } from '@common/util/validationUtils';
import { Button, ErrorMessage } from '@digdir/design-system-react';
import { MinusCircleIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { useCallback, useEffect, useState } from 'react';
import {
  ArrayPath,
  FieldArray,
  FieldArrayWithId,
  Path,
  PathValue,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';

const extractType = <T extends FieldArrayWithId>(obj: T): Omit<T, 'id'> => {
  const { id, ...rest } = obj;
  return rest as Omit<T, 'id'>;
};

interface Props<
  FormDataType extends object,
  ResultDataType extends PathValue<FormDataType, Path<FormDataType>>,
> {
  fieldName: ArrayPath<FormDataType>;
  defaultValues: FieldArray<FormDataType, ArrayPath<FormDataType>>;
  autocompleteProps: AutoCompleteProps<FormDataType, ResultDataType>;
  buttonAddText?: string;
  buttonRemoveText?: string;
}

const TestlabFormFieldArrayAutocomplete = <
  FormDataType extends object,
  ResultDataType extends PathValue<FormDataType, Path<FormDataType>>,
>({
  fieldName,
  defaultValues,
  autocompleteProps,
  buttonAddText = 'Legg til',
  buttonRemoveText = 'Fjern',
}: Props<FormDataType, ResultDataType>) => {
  const [defaultValueIdx, setDefaultValueIdx] = useState<number | undefined>();
  const { control, clearErrors, formState } = useFormContext<FormDataType>();
  const { fields, append, remove, insert } = useFieldArray({
    name: fieldName,
    control,
  });

  useEffect(() => {
    const fieldsWithoutId = fields.map((field) =>
      JSON.stringify(extractType(field))
    );
    const defaultValueIndex = fieldsWithoutId.indexOf(
      JSON.stringify(defaultValues)
    );
    setDefaultValueIdx(defaultValueIndex >= 0 ? defaultValueIndex : undefined);
  }, [fields]);

  const {
    label,
    resultList,
    resultLabelKey,
    resultDescriptionKey,
    onChange,
    name,
    retainValueOnClick,
    required,
    spacing,
    customError,
  } = autocompleteProps;

  const onClickAutocomplete = useCallback(
    (value: ResultDataType, idx: number) => {
      insert(idx, value);
      remove(idx + 1);
      clearErrors();
      setDefaultValueIdx(undefined);
    },
    []
  );

  const onClickAdd = () => {
    if (isNotDefined(defaultValueIdx)) {
      append(defaultValues);
      setDefaultValueIdx(fields.length);
      clearErrors();
    }
  };

  const onClickRemove = (idx: number) => {
    remove(idx);
    if (idx === defaultValueIdx) {
      setDefaultValueIdx(undefined);
    }
  };

  const errorMessage = getErrorMessage(formState, fieldName);

  return (
    <div className="testlab-form__field-array">
      {fields.map((field, idx) => {
        const valueLabel = getLabelString(field, resultLabelKey);

        return (
          <div className="testlab-form__field-array-entry" key={field.id}>
            <ConditionalComponentContainer
              condition={isDefined(valueLabel)}
              conditionalComponent={
                <div className="testlab-form__field-array-entry-label">
                  {valueLabel}
                </div>
              }
              otherComponent={
                <div className="testlab-form__field-array-entry__input">
                  <TestlabFormAutocomplete<FormDataType, ResultDataType>
                    label={label}
                    resultList={resultList}
                    resultLabelKey={resultLabelKey}
                    resultDescriptionKey={resultDescriptionKey}
                    onChange={onChange}
                    onClick={(value) => onClickAutocomplete(value, idx)}
                    name={name}
                    retainValueOnClick={retainValueOnClick}
                    required={required}
                    spacing={spacing}
                    customError={customError}
                    hideLabel
                  />
                </div>
              }
            />
            <Button
              size={ButtonSize.Small}
              variant={ButtonVariant.Quiet}
              type="button"
              onClick={() => onClickRemove(idx)}
              className="testlab-form__field-array-entry__button-add"
            >
              <MinusCircleIcon />
              {buttonRemoveText}
            </Button>
          </div>
        );
      })}
      <Button
        size={ButtonSize.Small}
        variant={ButtonVariant.Quiet}
        type="button"
        onClick={onClickAdd}
        disabled={isDefined(defaultValueIdx)}
      >
        <PlusCircleIcon />
        {buttonAddText}
      </Button>
      {errorMessage &&
        (fields.length === 0 || isNotDefined(defaultValueIdx)) && (
          <ErrorMessage size="small">{errorMessage}</ErrorMessage>
        )}
    </div>
  );
};

export default TestlabFormFieldArrayAutocomplete;
