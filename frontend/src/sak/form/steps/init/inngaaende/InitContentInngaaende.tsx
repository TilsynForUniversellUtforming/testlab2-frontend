import TestlabFormAutocomplete from '@common/form/autocomplete/TestlabFormAutocomplete';
import TestlabFormInput from '@common/form/TestlabFormInput';
import { isDefined, isValidObject } from '@common/util/validationUtils';
import { Loeysing } from '@loeysingar/api/types';
import SakVerksemdResult from '@sak/form/steps/init/inngaaende/SakVerksemdResult';
import {
  defaultManualVerksemd,
  defaultValues,
} from '@sak/form/steps/init/inngaaende/types';
import VerksemdLoeysingRelationWrapper from '@sak/form/steps/init/inngaaende/verksemd-loeysing/VerksemdLoeysingRelationWrapper';
import useLoeysingAutocomplete from '@sak/hooks/useLoeysingAutocomplete';
import { SakFormState, SakVerksemdLoeysingRelation } from '@sak/types';
import { getVerksemdLoeysingRelations_dummy } from '@verksemder/api/verksemd-api';
import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

const InitContentInngaaende = () => {
  const [loadingRelations, setLoadingRelations] = useState(false);
  const [errorMessageRelations, setErrorMessageRelations] = useState<string>();
  const [noVerksemdLoeysingRelations, setNoVerksemdLoeysingRelations] =
    useState(true);
  const [showManualEntry, setShowManualEntry] = useState<boolean>(false);

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

  useEffect(() => {
    setShowManualEntry(
      verksemdNotFound ||
        isValidObject(verksemdLoeysingRelation?.manualVerksemd)
    );
  }, [verksemdNotFound, verksemdLoeysingRelation?.manualVerksemd]);

  useEffect(() => {
    if (verksemdNotFound) {
      setValue('verksemdLoeysingRelation.loeysingList', [defaultValues]);
    }
  }, [verksemdNotFound]);

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
    setValue('verksemdLoeysingRelation.manualVerksemd', defaultManualVerksemd);
    handleGetVerksemdLoeysingRelations(verksemd).then(
      (verksemdLoeysingRelationList) => {
        if (isDefined(verksemdLoeysingRelationList)) {
          setValue(
            'verksemdLoeysingRelation.loeysingList',
            verksemdLoeysingRelationList.map((vlr) => ({
              ...vlr,
              useInTest: false,
            }))
          );
          setNoVerksemdLoeysingRelations(false);
        } else {
          setValue('verksemdLoeysingRelation.loeysingList', [defaultValues]);
          setNoVerksemdLoeysingRelations(true);
        }
      }
    );
  }, []);

  return (
    <>
      <TestlabFormInput
        label="Frist"
        description="Når skal testen vera gjennomført"
        name="frist"
        type="date"
        required
      />
      <TestlabFormAutocomplete<SakFormState, Loeysing>
        label="Namn på testobjekt"
        description="Legg til virksomhetsnavn eller orgnr."
        resultList={verksemdAutocompleteList}
        resultLabelKey="namn"
        resultDescriptionKey="orgnummer"
        onChange={onChangeAutocomplete}
        onClick={onClick}
        retainValueOnClick={false}
        name="verksemdLoeysingRelation.verksemd"
        customError={errorMessage}
        required
        spacing
      />
      <SakVerksemdResult
        verksemd={verksemdLoeysingRelation?.verksemd}
        showManualEntry={showManualEntry}
        loading={loadingRelations}
        errorMessageRelations={errorMessageRelations}
      />
      <VerksemdLoeysingRelationWrapper
        verksemdLoeysingRelation={verksemdLoeysingRelation}
        verksemdNotFound={verksemdNotFound}
        noVerksemdLoeysingRelations={noVerksemdLoeysingRelations}
      />
    </>
  );
};

export default InitContentInngaaende;
