import { Verksemd } from '@verksemder/api/types';
import {
  findVerksemdByName,
  findVerksemdByOrgnummer,
} from '@verksemder/api/verksemd-api';
import { useCallback, useState } from 'react';

const useVerksemdAutocomplete = () => {
  const [verksemdAutocompleteList, setVerksemdAutocompleteList] = useState<
    number[]
  >([]);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const [verksemdNotFound, setVerksemdNotFound] = useState(false);

  const onChangeAutocomplete = useCallback(async (verksemdSearch: string) => {
    setVerksemdNotFound(false);
    setErrorMessage(undefined);
    try {
      if (verksemdSearch.length > 0) {
        const verksemdlist: Verksemd[] = [];
        if (!isNaN(Number(verksemdSearch))) {
          const loeysingListByOrgNr =
            await findVerksemdByOrgnummer(verksemdSearch);
          verksemdlist.push(...loeysingListByOrgNr);
        } else {
          const loeysingListByName = await findVerksemdByName(verksemdSearch);
          verksemdlist.push(...loeysingListByName);
        }
        setVerksemdAutocompleteList(
          verksemdlist.map((verksemd) => verksemd.id)
        );

        if (verksemdlist.length === 0) {
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

export default useVerksemdAutocomplete;
