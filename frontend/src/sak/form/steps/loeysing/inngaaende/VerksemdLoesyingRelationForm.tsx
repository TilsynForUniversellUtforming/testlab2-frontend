import TestlabFormFieldArray from '@common/form/field-array/TestlabFormFieldArray';
import { getErrorMessage } from '@common/form/util';
import { Tabs } from '@digdir/design-system-react';
import { Loeysing } from '@loeysingar/api/types';
import useLoeysingAutocomplete from '@sak/hooks/useLoeysingAutocomplete';
import { SakFormState, VerksemdLoeysingRelation } from '@sak/types';
import { useEffect, useState } from 'react';
import { FieldErrors, useFormContext } from 'react-hook-form';

const VerksemdLoesyingRelationForm = () => {
  const [errorForm, setErrorForm] = useState<string | undefined>();

  const defaultValues: Loeysing = {
    id: 0,
    namn: '',
    url: '',
    orgnummer: '0',
  };

  const { virksomhetAutocompleteList, onChangeAutocomplete, errorMessage } =
    useLoeysingAutocomplete();

  const { formState } = useFormContext<SakFormState>();

  useEffect(() => {
    const error = (formState.errors as FieldErrors<SakFormState>)[
      'verksemd'
    ] as FieldErrors<VerksemdLoeysingRelation>;

    const verksemdError = getErrorMessage(formState, 'verksemd');
    if (verksemdError) {
      setErrorForm(verksemdError);
    } else if (error && error['loeysingList']) {
      setErrorForm(error['loeysingList']?.message as string);
    } else {
      setErrorForm(undefined);
    }
  }, [formState.errors]);

  return (
    <Tabs value="manuelt" onClick={(e) => e.preventDefault()}>
      <Tabs.List>
        <Tabs.Tab value="manuelt">Legg inn manuelt</Tabs.Tab>
        <Tabs.Tab value="import">Importer fil</Tabs.Tab>
      </Tabs.List>
      <Tabs.Content value="manuelt">
        <TestlabFormFieldArray<SakFormState, Loeysing>
          fieldName="verksemd.loeysingList"
          defaultValues={defaultValues}
          buttonAddText="Legg til løysing"
          buttonRemoveText="Fjern løysing"
          errorMessageForm={errorForm}
          autocompleteProps={{
            label: 'Namn på løysing',
            resultList: virksomhetAutocompleteList,
            resultLabelKey: 'namn',
            resultDescriptionKey: 'orgnummer',
            onChange: onChangeAutocomplete,
            name: 'verksemd.loeysingList',
            errorMessage: errorMessage,
            retainSelection: false,
            required: true,
            spacing: true,
          }}
        />
      </Tabs.Content>
    </Tabs>
  );
};

export default VerksemdLoesyingRelationForm;
