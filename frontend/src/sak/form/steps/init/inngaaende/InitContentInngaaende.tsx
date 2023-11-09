import TestlabFormAutocomplete from '@common/form/autocomplete/TestlabFormAutocomplete';
import { Loeysing } from '@loeysingar/api/types';
import SakVerksemdResult from '@sak/form/steps/init/inngaaende/SakVerksemdResult';
import useLoeysingAutocomplete from '@sak/hooks/useLoeysingAutocomplete';
import { SakFormState, SakVerksemdLoeysingRelation } from '@sak/types';
import { getVerksemdLoeysingRelations_dummy } from '@verksemder/api/verksemd-api';
import React, { useCallback, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

const InitContentInngaaende = () => {
  const [loadingRelations, setLoadingRelations] = useState(false);
  const [errorMessageRelations, setErrorMessageRelations] = useState<string>();

  const { control, setValue } = useFormContext<SakFormState>();
  const verksemdLoeysingRelation = useWatch<SakFormState>({
    control,
    name: 'verksemdLoeysingRelation',
  }) as SakVerksemdLoeysingRelation | undefined;

  const {
    verksemdAutocompleteList,
    onChangeAutocomplete,
    verksemdNotFound,
    errorMessage,
  } = useLoeysingAutocomplete();

  const handleGetVerksemdLoeysingRelations = async (verksemd: Loeysing) => {
    setErrorMessageRelations(undefined);
    setLoadingRelations(true);

    const doGetVerksemdLoeysingRelations = async (verksemd: Loeysing) => {
      try {
        return await getVerksemdLoeysingRelations_dummy(verksemd);
      } catch (e) {
        setErrorMessageRelations(
          'Kunne ikkje henta kopling mellom verksemd og løysingar'
        );
      }
    };

    return doGetVerksemdLoeysingRelations(verksemd).finally(() =>
      setLoadingRelations(false)
    );
  };

  const onClick = useCallback((verksemd: Loeysing) => {
    setValue('verksemdLoeysingRelation.verksemd', verksemd);
    handleGetVerksemdLoeysingRelations(verksemd).then(
      (verksemdLoeysingRelationList) => {
        if (verksemdLoeysingRelationList) {
          setValue(
            'verksemdLoeysingRelation.loeysingList',
            verksemdLoeysingRelationList
          );
        }
      }
    );
  }, []);

  return (
    <>
      <TestlabFormAutocomplete<SakFormState, Loeysing>
        label="Navn på testobjekt"
        description="Søk etter virksomhetsnavn eller orgnr."
        resultList={verksemdAutocompleteList}
        resultLabelKey="namn"
        resultDescriptionKey="orgnummer"
        onChange={onChangeAutocomplete}
        onClick={onClick}
        retainSelection={false}
        name="verksemdLoeysingRelation.verksemd"
        customError={errorMessage}
        required
        spacing
      />
      <SakVerksemdResult
        verksemd={verksemdLoeysingRelation?.verksemd}
        manualVerksemd={verksemdLoeysingRelation?.manualVerksemd}
        verksemdNotFound={verksemdNotFound}
        loading={loadingRelations}
        errorMessageRelations={errorMessageRelations}
      />
    </>
  );
};

export default InitContentInngaaende;
