import { Spinner } from '@digdir/design-system-react';
import React, { useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import toError from '../common/error/util';
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
  }: LoeysingContext = useOutletContext();
  const navigate = useNavigate();

  const onSubmit = useCallback((loeysingInit: LoeysingInit) => {
    const doCreateLoeysing = async () => {
      setContextLoading(true);
      setContextError(undefined);

      if (loeysingInit) {
        const loeysing: LoeysingInit = {
          namn: loeysingInit.namn,
          url: loeysingInit.url,
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

  if (contextLoading) {
    return <Spinner title="Henter løysingar" />;
  }

  return <LoeysingForm heading="Ny løysing" onSubmit={onSubmit} />;
};

export default LoeysingCreate;
