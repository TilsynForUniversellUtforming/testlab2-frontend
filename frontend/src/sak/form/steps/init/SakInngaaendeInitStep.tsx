import toError from '@common/error/util';
import TestlabFormAutocomplete from '@common/form/autocomplete/TestlabFormAutocomplete';
import { getErrorMessage } from '@common/form/util';
import TestlabSearch from '@common/search/TestlabSearch';
import { isOrgnummer } from '@common/util/util';
import { ErrorMessage } from '@digdir/design-system-react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  findLoeysingByName,
  findLoeysingByOrgnummer,
} from '@loeysingar/api/loeysing-api';
import { Loeysing } from '@loeysingar/api/types';
import VerksemdResult from '@sak/form/steps/init/VerksemdResult';
import { sakInitVerksemdValidationSchema } from '@sak/form/steps/sakFormValidationSchema';
import { SakContext, SakFormBaseProps, SakFormState } from '@sak/types';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';

import SakStepFormWrapper from '../../SakStepFormWrapper';

const SakInngaaendeInitStep = ({
  formStepState,
  sakFormState,
  onSubmit,
}: SakFormBaseProps) => {
  const { setContextError }: SakContext = useOutletContext();
  const [virksomhetAutocompleteList, setVirksomhetAutocompleteList] = useState<
    Loeysing[]
  >([]);

  const [autoCompleteError, setAutoCompleteError] = useState<string>();
  const [searchError, setSearchError] = useState<string>();

  const formMethods = useForm<SakFormState>({
    defaultValues: sakFormState,
    resolver: zodResolver(sakInitVerksemdValidationSchema),
  });

  const { control, formState, setValue } = formMethods;
  const [errorMessage, setErrorMessage] = useState(
    getErrorMessage(formState, 'testregelList')
  );

  useEffect(() => {
    setErrorMessage(getErrorMessage(formState, 'testregelList'));
  }, [formState.errors]);

  const verksemd = useWatch<SakFormState>({
    control,
    name: 'verksemd',
  }) as Loeysing | undefined;

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
    <SakStepFormWrapper
      formStepState={formStepState}
      onSubmit={onSubmit}
      formMethods={formMethods}
      hasRequiredFields
    >
      <div className="sak-init">
        <TestlabFormAutocomplete<SakFormState, Loeysing>
          label="Navn på testobjekt"
          description="Søk etter virksomhetsnavn, kommunenavn eller etat"
          resultList={virksomhetAutocompleteList}
          resultLabelKey={'namn'}
          onChange={onChangeAutocomplete}
          errorMessage={autoCompleteError}
          name="verksemd"
          required
        />
        <TestlabSearch
          label="Organisasjonsnummer"
          description="Søk etter organisasjonsnummer"
          onClickSearch={onClickSearch}
          searchText="Hent informasjon"
          errorMessage={searchError}
          required
        />
        <VerksemdResult verksemd={verksemd} />
        {errorMessage && (
          <ErrorMessage size="small">{errorMessage}</ErrorMessage>
        )}
      </div>
    </SakStepFormWrapper>
  );
};

export default SakInngaaendeInitStep;
