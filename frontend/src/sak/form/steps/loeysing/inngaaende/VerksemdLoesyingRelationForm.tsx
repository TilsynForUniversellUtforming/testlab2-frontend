import TestlabFormAutocomplete from '@common/form/autocomplete/TestlabFormAutocomplete';
import TestlabFormFieldArray from '@common/form/field-array/TestlabFormFieldArray';
import { Loeysing } from '@loeysingar/api/types';
import useLoeysingAutocomplete from '@sak/hooks/useLoeysingAutocomplete';
import { SakFormState } from '@sak/types';
import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

const VerksemdLoesyingRelationForm = () => {
  const defaultValues: Loeysing = {
    id: 0,
    namn: '',
    url: '',
    orgnummer: '0',
  };

  const { virksomhetAutocompleteList, onChangeAutocomplete } =
    useLoeysingAutocomplete();

  const { control, setValue } = useFormContext<SakFormState>();

  const source = useWatch<SakFormState>({
    control,
    name: 'verksemd.loeysingList',
  }) as Loeysing[] | undefined;

  const onClickLoeysing = useCallback(
    (loeysing: Loeysing) => {
      const updatedLoeysingList = source || [];
      updatedLoeysingList.push(loeysing);
      setValue('verksemd.loeysingList', updatedLoeysingList);
    },
    [source]
  );

  return (
    <>
      <TestlabFormFieldArray<SakFormState>
        fieldName="verksemd.loeysingList"
        defaultValues={defaultValues}
      >
        <TestlabFormAutocomplete<SakFormState, Loeysing>
          label="Namn på løysing"
          resultList={virksomhetAutocompleteList}
          resultLabelKey="namn"
          resultDescriptionKey="orgnummer"
          onChange={onChangeAutocomplete}
          onClick={onClickLoeysing}
          name="verksemd.loeysingList"
          retainSelection
          required
          spacing
        />
      </TestlabFormFieldArray>
    </>
  );
};

export default VerksemdLoesyingRelationForm;
