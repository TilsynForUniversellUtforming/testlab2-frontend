import useAlert from '@common/alert/useAlert';
import LoeysingFormSkeleton from '@loeysingar/form/skeleton/LoeysingFormSkeleton';
import React, { useCallback, useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

import { updateLoeysing } from './api/loeysing-api';
import { Loeysing, LoeysingInit } from './api/types';
import LoeysingForm from './form/LoeysingForm';
import { LoeysingContext } from './types';

const getLoeysing = (loeysingList: Loeysing[], id: string | undefined) =>
  loeysingList.find((loeysing) => loeysing.id === Number(id));

const LoeysingEdit = () => {
  const {
    loeysingList,
    contextLoading,
    setContextError,
    setLoeysingList,
  }: LoeysingContext = useOutletContext();
  const { id } = useParams();
  const [loeysing, setLoeysing] = useState(getLoeysing(loeysingList, id));
  const [loading, setLoading] = useState(contextLoading);
  const [alert, setAlert] = useAlert();

  useEffect(() => {
    const foundLoeysing = getLoeysing(loeysingList, id);
    if (foundLoeysing) {
      setLoeysing(foundLoeysing);
      setLoading(false);
    }
  }, [loeysingList]);

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
          };

          const existingLoeysing = loeysingList.find(
            (l) => l.url === loeysing.url && l.orgnummer === loeysing.orgnummer
          );
          if (existingLoeysing) {
            setAlert(
              'danger',
              `Løysing med orgnr. ${loeysing.orgnummer} og url ${loeysing.url} finst allereie`
            );
            return;
          }
          try {
            setLoading(true);
            const updatedLoeysingList = await updateLoeysing(loeysing);
            setLoeysingList(updatedLoeysingList);
            setAlert('success', `${loeysing.namn} er endra`);
          } catch (e) {
            setContextError(new Error('Kunne ikkje endre løysing'));
          }
        } else {
          setContextError(new Error('Løysingparameter ikkje gylding'));
        }
      };

      doEditLoeysing();
    },
    [loeysingList]
  );

  if (loading) {
    return (
      <LoeysingFormSkeleton heading="Endre løysing" subHeading="Laster..." />
    );
  }

  return (
    <LoeysingForm
      heading="Endre løysing"
      subHeading={loeysing?.namn}
      onSubmit={onSubmit}
      loeysing={loeysing}
      alert={alert}
    />
  );
};

export default LoeysingEdit;
