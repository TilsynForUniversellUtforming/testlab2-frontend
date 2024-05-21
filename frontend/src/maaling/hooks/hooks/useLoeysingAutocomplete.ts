import {
  findLoeysingByName,
  findLoeysingByOrgnummer,
} from '@loeysingar/api/loeysing-api';
import { Loeysing } from '@loeysingar/api/types';
import { useCallback, useState } from 'react';

const useLoeysingAutocomplete = () => {
  const [verksemdAutocompleteList, setVerksemdAutocompleteList] = useState<
    Loeysing[]
  >([]);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const [verksemdNotFound, setVerksemdNotFound] = useState(false);

  const onChangeAutocomplete = useCallback(async (verksemdSearch: string) => {
    setVerksemdNotFound(false);
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
        setVerksemdAutocompleteList(loeysingList);

        if (loeysingList.length === 0) {
          setVerksemdNotFound(true);
          setErrorMessage(`Fann ikkje ${verksemdSearch}`);
        }
      } else {
        setVerksemdAutocompleteList([]);
      }
    } catch (e) {
      setErrorMessage(
        'Noko gjekk gale ved henting av løysing, ver vennleg og prøv igjen'
      );
    }
  }, []);

  return {
    verksemdAutocompleteList,
    onChangeAutocomplete,
    verksemdNotFound,
    errorMessage,
  };
};

export default useLoeysingAutocomplete;
