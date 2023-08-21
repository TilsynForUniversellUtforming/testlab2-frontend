import useAlert from '@common/alert/useAlert';
import toError from '@common/error/util';
import LoeysingFormSkeleton from '@loeysingar/form/skeleton/LoeysingFormSkeleton';
import React, { useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';

import { createLoeysing } from './api/loeysing-api';
import { LoeysingInit } from './api/types';
import LoeysingForm from './form/LoeysingForm';
import { LoeysingContext } from './types';

const LoeysingCreate = () => {
  const {
    contextLoading,
    setContextLoading,
    setContextError,
    setLoeysingList,
    loeysingList,
  }: LoeysingContext = useOutletContext();
  const [alert, setAlert] = useAlert();

  const onSubmit = useCallback(
    (loeysingInit: LoeysingInit) => {
      const doCreateLoeysing = async () => {
        if (loeysingInit) {
          const orgnummerWithoutWhitespace =
            loeysingInit.organisasjonsnummer.replace(/\s/g, '');
          const loeysing: LoeysingInit = {
            namn: loeysingInit.namn,
            url: loeysingInit.url,
            organisasjonsnummer: orgnummerWithoutWhitespace,
          };

          const existingLoeysing = loeysingList.find(
            (l) =>
              l.url === loeysing.url &&
              l.orgnummer === loeysing.organisasjonsnummer
          );
          if (existingLoeysing) {
            setAlert(
              'danger',
              `Løysing med orgnr. ${loeysing.organisasjonsnummer} og url ${loeysing.url} finst allereie`
            );
            return;
          }

          try {
            setContextLoading(true);
            const updatedLoeysingList = await createLoeysing(loeysing);
            setLoeysingList(updatedLoeysingList);
            setAlert('success', `${loeysing.namn} er oppretta`);
          } catch (e) {
            setContextError(toError(e, 'Kunne ikkje opprette løysing'));
          }
        } else {
          setContextError(new Error('Løysingparameter ikkje gyldig'));
        }
      };

      doCreateLoeysing().finally(() => {
        setContextLoading(false);
      });
    },
    [loeysingList]
  );

  if (contextLoading) {
    return (
      <LoeysingFormSkeleton
        heading="Ny løysing"
        subHeading="Her kan du opprette ei ny løsying."
      />
    );
  }

  return (
    <LoeysingForm
      heading="Ny løysing"
      onSubmit={onSubmit}
      subHeading="Her kan du opprette ei ny løsying."
      alert={alert}
    />
  );
};

export default LoeysingCreate;
