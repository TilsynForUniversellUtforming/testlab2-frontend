import TestlabDivider from '@common/divider/TestlabDivider';
import TestlabFormAutocomplete from '@common/form/autocomplete/TestlabFormAutocomplete';
import { getErrorMessage } from '@common/form/util';
import { Loeysing } from '@loeysingar/api/types';
import SakVerksemdResult from '@sak/form/steps/init/inngaaende/SakVerksemdResult';
import useLoeysingAutocomplete from '@sak/hooks/useLoeysingAutocomplete';
import { SakFormState, VerksemdLoeysingRelation } from '@sak/types';
import { getVerksemdLoesyingRelations_dummy } from '@verksemder/api/verksemd-api';
import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

const InitContentInngaaende = () => {
  const {
    virksomhetAutocompleteList,
    onChangeAutocomplete,
    errorMessage,
    setErrorMessage,
  } = useLoeysingAutocomplete();

  const [loadingRelations, setLoadingRelations] = useState(false);
  const [errorMessageRelations, setErrorMessageRelations] = useState<string>();
  const { control, formState, setValue } = useFormContext<SakFormState>();
  const verksemd = useWatch<SakFormState>({
    control,
    name: 'verksemd',
  }) as VerksemdLoeysingRelation | undefined;

  useEffect(() => {
    const errorMessage = verksemd
      ? undefined
      : getErrorMessage(formState, 'verksemd');
    setErrorMessage(errorMessage);
  }, [formState, verksemd]);

  const handleGeterksemdLoesyingRelations = async (verksemd: Loeysing) => {
    setErrorMessageRelations(undefined);
    setLoadingRelations(true);
    const doGetVerksemdLoesyingRelations = async (verksemd: Loeysing) => {
      try {
        return await getVerksemdLoesyingRelations_dummy(verksemd);
      } catch (e) {
        setErrorMessageRelations(
          'Kunne ikkje henta kopling mellom verksemd og løysingar'
        );
      }
    };

    return doGetVerksemdLoesyingRelations(verksemd).finally(() =>
      setLoadingRelations(false)
    );
  };

  const onClick = useCallback((verksemd: Loeysing) => {
    handleGeterksemdLoesyingRelations(verksemd).then(
      (verksemdLoesyingRelation) =>
        setValue('verksemd', verksemdLoesyingRelation)
    );
  }, []);

  return (
    <>
      <TestlabFormAutocomplete<SakFormState, Loeysing>
        label="Navn på testobjekt"
        description="Søk etter virksomhetsnavn eller orgnr."
        resultList={virksomhetAutocompleteList}
        resultLabelKey="namn"
        resultDescriptionKey="orgnummer"
        onChange={onChangeAutocomplete}
        onClick={onClick}
        retainSelection={false}
        errorMessage={errorMessage}
        name="verksemd"
        required
        spacing
      />
      {verksemd && <TestlabDivider size="large" />}
      <SakVerksemdResult
        verksemd={verksemd}
        loading={loadingRelations}
        errorMessage={errorMessageRelations}
      />
    </>
  );
};

export default InitContentInngaaende;
