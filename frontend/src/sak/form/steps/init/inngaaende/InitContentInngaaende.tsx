import TestlabDivider from '@common/divider/TestlabDivider';
import toError from '@common/error/util';
import TestlabFormAutocomplete from '@common/form/autocomplete/TestlabFormAutocomplete';
import { getErrorMessage } from '@common/form/util';
import TestlabSearch from '@common/search/TestlabSearch';
import { isOrgnummer } from '@common/util/validationUtils';
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

  const [autoCompleteError, setAutoCompleteError] = useState<string>();
  const [searchError, setSearchError] = useState<string>();
  const { control, setValue, formState } = useFormContext<SakFormState>();
  const verksemd = useWatch<SakFormState>({
    control,
    name: 'verksemd',
  }) as Loeysing | undefined;

  useEffect(() => {
    const errorMessage = verksemd
      ? undefined
      : getErrorMessage(formState, 'verksemd');
    setSearchError(errorMessage);
    setAutoCompleteError(errorMessage);
  }, [formState, verksemd]);

  const onChangeAutocomplete = useCallback(async (verksemdSearch: string) => {
    setAutoCompleteError(undefined);
    try {
      if (verksemdSearch.length > 0) {
        const loeysingList = await findLoeysingByName(verksemdSearch);
        setVirksomhetAutocompleteList(loeysingList.slice(0, 10));

        if (loeysingList.length === 0) {
          setAutoCompleteError(
            `Fann ikkje viksomhet med namn ${verksemdSearch}`
          );
        }
      } else {
        setVirksomhetAutocompleteList([]);
      }
    } catch (e) {
      setContextError(toError(e, 'Kunne ikkje hente løysingar'));
    }
  }, []);

  const onClickSearch = useCallback(async (orgnummer: string) => {
    setSearchError(undefined);
    if (!orgnummer) {
      setSearchError('Du må skrive eit organisasjonsnummer');
      return;
    }
    if (!isOrgnummer(orgnummer)) {
      setSearchError(`${orgnummer} er ikkje eit gyldig organisasjonsnummer`);
    } else {
      try {
        const orgnummerWithoutWhitespace = orgnummer.replace(/\s/g, '');
        const loeysingList = await findLoeysingByOrgnummer(
          orgnummerWithoutWhitespace
        );
        if (loeysingList.length > 0) {
          setValue('verksemd', loeysingList[0]);
        } else {
          setSearchError(`Fann ikkje virksomhet for orgnummer ${orgnummer}`);
        }
      } catch (e) {
        setContextError(toError(e, 'Kunne ikkje hente løysingar'));
      }
    }
  }, []);

  return (
    <>
      <TestlabFormAutocomplete<SakFormState, Loeysing>
        label="Navn på testobjekt"
        description="Søk etter virksomhetsnavn, kommunenavn eller etat"
        resultList={virksomhetAutocompleteList}
        resultLabelKey="namn"
        onChange={onChangeAutocomplete}
        errorMessage={autoCompleteError}
        name="verksemd"
        required
        spacing
      />
      <TestlabSearch
        label="Organisasjonsnummer"
        description="Søk etter organisasjonsnummer"
        onClickSearch={onClickSearch}
        searchText="Hent informasjon"
        errorMessage={searchError}
        required
      />
      {verksemd && <TestlabDivider size="large" />}
      <SakVerksemdResult verksemd={verksemd} />
    </>
  );
};

export default InitContentInngaaende;
