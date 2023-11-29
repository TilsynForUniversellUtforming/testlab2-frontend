import TestlabLinkButton from '@common/button/TestlabLinkButton';
import TestlabFormFieldArrayAutocomplete from '@common/form/field-array/TestlabFormFieldArrayAutocomplete';
import { LOEYSING_CREATE } from '@loeysingar/LoeysingRoutes';
import { defaultValues } from '@sak/form/steps/init/inngaaende/types';
import useLoeysingAutocomplete from '@sak/hooks/useLoeysingAutocomplete';
import { LoeysingNettsideRelationTest, SakFormState } from '@sak/types';
import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

const VerksemdLoeysingRelationForm = () => {
  const { control } = useFormContext<SakFormState>();

  const { verksemdAutocompleteList, onChangeAutocomplete, errorMessage } =
    useLoeysingAutocomplete();

  const selectedLoeysingList = useWatch<SakFormState>({
    control,
    name: 'verksemdLoeysingRelation.loeysingList',
  }) as LoeysingNettsideRelationTest[];

  const loeysingList: LoeysingNettsideRelationTest[] = useMemo(() => {
    if (verksemdAutocompleteList.length > 0) {
      const selectedLoeysingIdList = selectedLoeysingList.map(
        (lnr) => lnr.loeysing.id
      );
      return verksemdAutocompleteList
        .filter((l) => !selectedLoeysingIdList.includes(l.id))
        .map((loeysing) => ({
          loeysing: loeysing,
          properties: [],
          useInTest: true,
        }));
    } else {
      return [];
    }
  }, [verksemdAutocompleteList, selectedLoeysingList]);

  return (
    <>
      <TestlabFormFieldArrayAutocomplete<
        SakFormState,
        LoeysingNettsideRelationTest
      >
        fieldName="verksemdLoeysingRelation.loeysingList"
        defaultValues={defaultValues}
        buttonAddText="Legg til løysing"
        buttonRemoveText="Fjern løysing"
        autocompleteProps={{
          label: 'Namn på løysing',
          resultList: loeysingList,
          resultLabelKey: 'loeysing.namn',
          resultDescriptionKey: 'loeysing.url',
          onChange: onChangeAutocomplete,
          name: 'verksemdLoeysingRelation.loeysingList',
          retainValueOnClick: false,
          customError: errorMessage,
          required: true,
        }}
      />
      {errorMessage && (
        <TestlabLinkButton
          title="Legg inn løsying (ekstern)"
          route={LOEYSING_CREATE}
          redirectExternal
          size="small"
        />
      )}
    </>
  );
};

export default VerksemdLoeysingRelationForm;
