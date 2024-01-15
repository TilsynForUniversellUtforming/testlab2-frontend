import TestlabDivider from '@common/divider/TestlabDivider';
import { getErrorMessage } from '@common/form/util';
import { ButtonSize, ButtonVariant } from '@common/types';
import { Button, ErrorMessage } from '@digdir/design-system-react';
import NettsidePropertiesFormInput from '@sak/form/steps/loeysing/inngaaende/loeysing-nettside/NettsidePropertiesFormInput';
import { NettsideProperties, SakFormState } from '@sak/types';
import { Fragment, useMemo } from 'react';
import { Path, useFieldArray, useFormContext } from 'react-hook-form';

interface Props {
  loeysingIndex: number;
  onClose: () => void;
}

const NettsidePropertiesFieldArray = ({ loeysingIndex, onClose }: Props) => {
  const fieldName: Path<SakFormState> = `verksemdLoeysingRelation.loeysingList.${loeysingIndex}.properties`;
  const { control, clearErrors, formState } = useFormContext<SakFormState>();
  const { fields, append, remove } = useFieldArray({
    name: fieldName,
    control,
  });

  const defaultValues: NettsideProperties = {
    type: undefined,
    url: undefined,
    reason: undefined,
    description: undefined,
  };

  const onClickAdd = (type?: string) => {
    append({
      ...defaultValues,
      type: type,
    });
    clearErrors();
  };

  const onClickRemove = (idx: number) => {
    remove(idx);
  };

  const errorMessage = getErrorMessage(formState, fieldName);

  const indexes = new Map(fields.map(({ id }, index) => [id, index]));

  const sortedFields = useMemo(() => {
    return [...fields].sort((a, b) => {
      const typeA = a.type || 'z';
      const typeB = b.type || 'z';

      return typeA.localeCompare(typeB);
    });
  }, [fields]);

  return (
    <div className="sak-loeysing__nettsted-props testlab-form__field-array">
      {sortedFields.map((field, idx, array) => {
        const sortedIdx = indexes.get(field.id) || 0;
        const addBreak = idx !== 0 && field.type !== array[idx - 1].type;

        return (
          <Fragment key={field.id}>
            {addBreak && <TestlabDivider size="small" />}
            <div className="testlab-form__field-array-entry">
              <NettsidePropertiesFormInput
                isWeb
                onClickAdd={onClickAdd}
                onClickRemove={() => onClickRemove(sortedIdx)}
                nameType={`verksemdLoeysingRelation.loeysingList.${loeysingIndex}.properties.${sortedIdx}.type`}
                nameUrl={`verksemdLoeysingRelation.loeysingList.${loeysingIndex}.properties.${sortedIdx}.url`}
                nameReason={`verksemdLoeysingRelation.loeysingList.${loeysingIndex}.properties.${sortedIdx}.reason`}
                nameDescription={`verksemdLoeysingRelation.loeysingList.${loeysingIndex}.properties.${sortedIdx}.description`}
              />
            </div>
          </Fragment>
        );
      })}
      <div className="testlab-form__navigation-buttons">
        <Button
          size={ButtonSize.Small}
          variant={ButtonVariant.Outline}
          type="button"
          onClick={() => onClickAdd()}
        >
          Legg til side
        </Button>
        <Button
          size={ButtonSize.Small}
          type="button"
          onClick={onClose}
          variant={ButtonVariant.Outline}
        >
          Lukk
        </Button>
      </div>
      {errorMessage && <ErrorMessage size="small">{errorMessage}</ErrorMessage>}
    </div>
  );
};

export default NettsidePropertiesFieldArray;
