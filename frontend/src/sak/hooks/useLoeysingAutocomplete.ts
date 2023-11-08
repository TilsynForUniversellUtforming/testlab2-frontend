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
  const [verksemdAutocompleteList, setVerksemdAutocompleteList] = useState<
    Loeysing[]
  >([]);
  const [verksemdNotFound, setVerksemdNotFound] = useState(false);

  const { setContextError } = useOutletContext<SakContext>();

  const onChangeAutocomplete = useCallback(
    async (verksemdSearch: string) => {
      setVerksemdNotFound(false);
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
          }
        } else {
          setVerksemdAutocompleteList([]);
        }
      } catch (e) {
        setContextError(toError(e, 'Kunne ikkje hente løysingar'));
      }
    },
    [setContextError]
  );

  return {
    verksemdAutocompleteList,
    onChangeAutocomplete,
    verksemdNotFound,
  };
};

export default useLoeysingAutocomplete;
