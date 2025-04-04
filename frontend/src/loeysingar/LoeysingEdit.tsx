import useAlert from '@common/alert/useAlert';
import useContentDocumentTitle from '@common/hooks/useContentDocumentTitle';
import { LOEYSING_EDIT } from '@loeysingar/LoeysingRoutes';
import React, { useCallback, useState } from 'react';
import { useLoaderData, useOutletContext, useParams } from 'react-router-dom';

import { updateLoeysing } from './api/loeysing-api';
import { Loeysing, LoeysingFormElement, LoeysingInit } from './api/types';
import LoeysingForm from './form/LoeysingForm';
import { LoeysingContext } from './types';

const LoeysingEdit = () => {
  const { loeysingList, setContextError, setLoeysingList }: LoeysingContext =
    useOutletContext();
  const { id } = useParams();
  const initLoeysing = useLoaderData() as LoeysingFormElement;
  const [loeysing, setLoeysing] = useState(initLoeysing);
  const [alert, setAlert] = useAlert();

  useContentDocumentTitle(LOEYSING_EDIT.navn, loeysing?.namn);

  const onSubmit = useCallback(
    (loeysingInit: LoeysingInit) => {
      const doEditLoeysing = async () => {
        const orgnummerWithoutWhitespace =
          loeysingInit.organisasjonsnummer.replace(/\s/g, '');

        if (loeysingInit && id) {
          const loeysing: Loeysing = {
            id: Number(id),
            namn: loeysingInit.namn,
            url: loeysingInit.url,
            orgnummer: orgnummerWithoutWhitespace,
            verksemdId: loeysingInit.verksemd?.id,
          };

          const existingLoeysing = loeysingList.find(
            (l) =>
              l.id !== loeysing.id &&
              l.url === loeysing.url &&
              l.orgnummer === loeysing.orgnummer
          );
          if (existingLoeysing) {
            setAlert(
              'danger',
              `Løysing med orgnr. ${loeysing.orgnummer} og url ${loeysing.url} finst allereie`
            );
            return;
          }
          try {
            const updatedLoeysingList = await updateLoeysing(loeysing);
            setLoeysingList(updatedLoeysingList);
            setLoeysing({
              ...loeysingInit,
              id: loeysing.id,
              orgnummer: loeysing.orgnummer,
            });
            setAlert('success', `${loeysing.namn} er endra`);
          } catch (e) {
            setContextError(new Error('Kunne ikkje endre løysing'));
          }
        } else {
          setContextError(new Error('Løysingparameter ikkje gyldig'));
        }
      };

      doEditLoeysing();
    },
    [loeysingList]
  );

  return (
    <LoeysingForm
      heading="Endre løysing"
      description={loeysing?.namn}
      onSubmit={onSubmit}
      loeysing={loeysing}
      alert={alert}
    />
  );
};

export default LoeysingEdit;
