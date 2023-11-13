import TestlabFormFieldArray from '@common/form/field-array/TestlabFormFieldArray';
import { Tabs } from '@digdir/design-system-react';
import useLoeysingAutocomplete from '@sak/hooks/useLoeysingAutocomplete';
import { LoeysingNettsideRelation, SakFormState } from '@sak/types';

const VerksemdLoeysingRelationForm = () => {
  const defaultValues: LoeysingNettsideRelation = {
    loeysing: { id: 0, namn: '', url: '', orgnummer: '' },
  };

  const { verksemdAutocompleteList, onChangeAutocomplete, errorMessage } =
    useLoeysingAutocomplete();

  const loeysingList: LoeysingNettsideRelation[] = verksemdAutocompleteList.map(
    (loeysing) => ({
      loeysing: loeysing,
      forside: undefined,
      navigasjonsmeny: undefined,
      bilder: undefined,
      overskrifter: undefined,
      artikkel: undefined,
      skjema: undefined,
      tabell: undefined,
      knapper: undefined,
    })
  );

  return (
    <>
      <Tabs value="manuelt" onClick={(e) => e.preventDefault()}>
        <Tabs.List>
          <Tabs.Tab value="manuelt">Legg inn manuelt</Tabs.Tab>
          <Tabs.Tab value="import">Importer fil</Tabs.Tab>
        </Tabs.List>
        <Tabs.Content value="manuelt">
          <TestlabFormFieldArray<SakFormState, LoeysingNettsideRelation>
            fieldName="verksemdLoeysingRelation.loeysingList"
            defaultValues={defaultValues}
            buttonAddText="Legg til løysing"
            buttonRemoveText="Fjern løysing"
            autocompleteProps={{
              label: 'Namn på løysing',
              resultList: loeysingList,
              resultLabelKey: 'loeysing.namn',
              resultDescriptionKey: 'loeysing.orgnummer',
              onChange: onChangeAutocomplete,
              name: 'verksemdLoeysingRelation.loeysingList',
              retainValueOnClick: false,
              customError: errorMessage,
              required: true,
            }}
          />
          {/*<LoeysingNettsideRelationForm />*/}
        </Tabs.Content>
      </Tabs>
    </>
  );
};

export default VerksemdLoeysingRelationForm;
