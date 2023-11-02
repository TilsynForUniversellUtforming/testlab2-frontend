import toError from '@common/error/util';
import {
  findLoeysingByName,
  findLoeysingByOrgnummer,
} from '@loeysingar/api/loeysing-api';
import { Loeysing } from '@loeysingar/api/types';
import { SakContext } from '@sak/types';
import { useCallback, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const useLoeysingAutocomplete = () => {
  const [virksomhetAutocompleteList, setVirksomhetAutocompleteList] = useState<
    Loeysing[]
  >([]);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const { setContextError } = useOutletContext<SakContext>();

  const onChangeAutocomplete = useCallback(
    async (verksemdSearch: string) => {
      setErrorMessage(undefined);
      try {
        if (verksemdSearch.length > 0) {
          const loeysingList: Loeysing[] = [];
          if (!isNaN(Number(verksemdSearch))) {
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
    },
    [setContextError]
  );

  return {
    virksomhetAutocompleteList,
    onChangeAutocomplete,
    errorMessage,
    setErrorMessage,
  };
};

export default useLoeysingAutocomplete;
