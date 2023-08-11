import toError from '@common/error/util';
import React, { useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { createLoeysing } from './api/loeysing-api';
import { LoeysingInit } from './api/types';
import LoeysingForm from './form/LoeysingForm';
import { LoeysingContext } from './types';

const LoeysingCreate = () => {
  const {
    setContextLoading,
    setContextError,
    setLoeysingList,
  }: LoeysingContext = useOutletContext();
  const navigate = useNavigate();

  const onSubmit = useCallback((loeysingInit: LoeysingInit) => {
    const doCreateLoeysing = async () => {
      setContextLoading(true);
      setContextError(undefined);

      if (loeysingInit) {
        const orgnummerWithoutWhitespace =
          loeysingInit.organisasjonsnummer.replace(/\s/g, '');
        const loeysing: LoeysingInit = {
          namn: loeysingInit.namn,
          url: loeysingInit.url,
          organisasjonsnummer: orgnummerWithoutWhitespace,
        };

        try {
          const updatedLoeysingList = await createLoeysing(loeysing);
          setLoeysingList(updatedLoeysingList);
          navigate('..');
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
  }, []);

  return (
    <LoeysingForm
      heading="Ny løysing"
      onSubmit={onSubmit}
      subHeading="Her kan du opprette ei ny løsying."
    />
  );
};

export default LoeysingCreate;
