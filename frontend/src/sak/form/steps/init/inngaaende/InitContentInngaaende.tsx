import TestlabDivider from '@common/divider/TestlabDivider';
import toError from '@common/error/util';
import TestlabFormAutocomplete from '@common/form/autocomplete/TestlabFormAutocomplete';
import { getErrorMessage } from '@common/form/util';
import { isDefined } from '@common/util/validationUtils';
import {
  findLoeysingByName,
  findLoeysingByOrgnummer,
} from '@loeysingar/api/loeysing-api';
import { Loeysing } from '@loeysingar/api/types';
import SakVerksemdResult from '@sak/form/steps/init/inngaaende/SakVerksemdResult';
import { SakContext, SakFormState } from '@sak/types';
import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';

const InitContentInngaaende = () => {
  const { setContextError }: SakContext = useOutletContext();
  const [virksomhetAutocompleteList, setVirksomhetAutocompleteList] = useState<
    Loeysing[]
  >([]);

  const [errorMessage, setErrorMessage] = useState<string>();
  const { control, formState } = useFormContext<SakFormState>();
  const verksemd = useWatch<SakFormState>({
    control,
    name: 'verksemd',
  }) as Loeysing | undefined;

  useEffect(() => {
    const errorMessage = verksemd
      ? undefined
      : getErrorMessage(formState, 'verksemd');
    setErrorMessage(errorMessage);
  }, [formState, verksemd]);

  const onChangeAutocomplete = useCallback(async (verksemdSearch: string) => {
    setErrorMessage(undefined);
    try {
      if (verksemdSearch.length > 0) {
        const loeysingList: Loeysing[] = [];
        if (isDefined(Number(verksemdSearch))) {
          const loeysingListByOrgNr =
            await findLoeysingByOrgnummer(verksemdSearch);
          loeysingList.push(...loeysingListByOrgNr);
        } else {
          const loeysingListByName = await findLoeysingByName(verksemdSearch);
          loeysingList.push(...loeysingListByName);
        }
        setVirksomhetAutocompleteList(loeysingList);

        if (loeysingList.length === 0) {
          setErrorMessage(`Fann ikkje ${verksemdSearch}`);
        }
      } else {
        setVirksomhetAutocompleteList([]);
      }
    } catch (e) {
      setContextError(toError(e, 'Kunne ikkje hente løysingar'));
    }
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
        errorMessage={errorMessage}
        name="verksemd"
        required
        spacing
      />
      {verksemd && <TestlabDivider size="large" />}
      <SakVerksemdResult verksemd={verksemd} />
    </>
  );
};

export default InitContentInngaaende;
