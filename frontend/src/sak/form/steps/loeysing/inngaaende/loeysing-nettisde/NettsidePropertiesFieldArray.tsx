import { getErrorMessage } from '@common/form/util';
import { ButtonSize, ButtonVariant } from '@common/types';
import { isDefined, isNotDefined } from '@common/util/validationUtils';
import { Button, ErrorMessage } from '@digdir/design-system-react';
import NettsidePropertiesFormInput from '@sak/form/steps/loeysing/inngaaende/loeysing-nettisde/NettsidePropertiesFormInput';
import { NettsidePropertyType } from '@sak/form/steps/loeysing/inngaaende/loeysing-nettisde/types';
import { NettsideProperties, SakFormState } from '@sak/types';
import { useEffect, useState } from 'react';
import {
  FieldArrayWithId,
  Path,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';

interface Props {
  loeysingIndex: number;
}

// TODO - flytt original til egen util klasse
const extractType = <T extends FieldArrayWithId>(obj: T): Omit<T, 'id'> => {
  const { id, ...rest } = obj;
  return rest as Omit<T, 'id'>;
};

const NettsidePropertiesFieldArray = ({ loeysingIndex }: Props) => {
  const fieldName: Path<SakFormState> = `verksemdLoeysingRelation.loeysingList.${loeysingIndex}.properties`;
  const [defaultValueIdx, setDefaultValueIdx] = useState<number | undefined>();
  const { control, clearErrors, formState } = useFormContext<SakFormState>();
  const { fields, append, remove } = useFieldArray({
    name: fieldName,
    control,
  });

  const defaultValues: NettsideProperties = {
    type: undefined,
    url: '',
    reason: '',
    description: '',
  };

  useEffect(() => {
    const fieldsWithoutId = fields.map((field) =>
      JSON.stringify(extractType(field))
    );
    const defaultValueIndex = fieldsWithoutId.indexOf(
      JSON.stringify(defaultValues)
    );
    setDefaultValueIdx(defaultValueIndex >= 0 ? defaultValueIndex : undefined);
  }, [fields]);

  const onClickAdd = (type?: NettsidePropertyType) => {
    if (isNotDefined(defaultValueIdx)) {
      const appendValues = type
        ? {
            ...defaultValues,
            type: type,
          }
        : defaultValues;

      append(appendValues);
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
    <div className="sak-loeysing__nettsted-props testlab-form__field-array">
      {fields.map((field, idx) => {
        return (
          <div className="testlab-form__field-array-entry" key={field.id}>
            <NettsidePropertiesFormInput
              isWeb
              disableAdd={isDefined(defaultValueIdx)}
              onClickAdd={onClickAdd}
              onClickRemove={() => onClickRemove(idx)}
              nameType={`verksemdLoeysingRelation.loeysingList.${loeysingIndex}.properties.${idx}.type`}
              nameUrl={`verksemdLoeysingRelation.loeysingList.${loeysingIndex}.properties.${idx}.url`}
              nameReason={`verksemdLoeysingRelation.loeysingList.${loeysingIndex}.properties.${idx}.reason`}
              nameDescription={`verksemdLoeysingRelation.loeysingList.${loeysingIndex}.properties.${idx}.description`}
            />
          </div>
        );
      })}
      <Button
        size={ButtonSize.Small}
        variant={ButtonVariant.Outline}
        type="button"
        onClick={() => onClickAdd()}
        disabled={isDefined(defaultValueIdx)}
      >
        Legg til side
      </Button>
      {errorMessage &&
        (fields.length === 0 || isNotDefined(defaultValueIdx)) && (
          <ErrorMessage size="small">{errorMessage}</ErrorMessage>
        )}
    </div>
  );
};

export default NettsidePropertiesFieldArray;
