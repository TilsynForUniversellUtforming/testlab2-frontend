import { Spinner } from '@digdir/design-system-react';
import React, { useCallback } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import ErrorCard from '../common/error/ErrorCard';
import { updateLoeysing } from './api/loeysing-api';
import { Loeysing, LoeysingInit } from './api/types';
import LoeysingForm from './form/LoeysingForm';
import { LoeysingContext } from './types';

const LoeysingEdit = () => {
  const {
    loeysingList,
    contextLoading,
    contextError,
    setContextLoading,
    setContextError,
    setLoeysingList,
  }: LoeysingContext = useOutletContext();
  const { id } = useParams();
  const loeysing = loeysingList.find((loeysing) => loeysing.id === Number(id));
  const navigate = useNavigate();

  const onSubmit = useCallback((loeysingInit: LoeysingInit) => {
    const doEditLoeysing = async () => {
      setContextLoading(true);
      setContextError(undefined);

      const orgnummerWithoutWhitespace = loeysingInit.orgnummer.replace(
        /\s/g,
        ''
      );
      if (loeysingInit && id) {
        const loeysing: Loeysing = {
          id: Number(id),
          namn: loeysingInit.namn,
          url: loeysingInit.url,
          orgnummer: orgnummerWithoutWhitespace,
        };

        try {
          const updatedLoeysingList = await updateLoeysing(loeysing);
          setLoeysingList(updatedLoeysingList);
          navigate('..');
        } catch (e) {
          setContextError(new Error('Kunne ikkje endre løysing'));
        }
      } else {
        setContextError(new Error('Løysingparameter ikkje gylding'));
      }
    };

    doEditLoeysing().finally(() => {
      setContextLoading(false);
    });
  }, []);

  if (contextLoading) {
    return <Spinner title="Henter løysing" />;
  }

  if (contextError) {
    return (
      <ErrorCard
        error={contextError ?? 'Finner ikkje løysing'}
        buttonText="Tilbake"
        onClick={() => navigate('..')}
      />
    );
  } else if (typeof loeysing === 'undefined') {
    return (
      <ErrorCard
        error={new Error('Finner ikkje løysing')}
        buttonText="Tilbake"
        onClick={() => navigate('..')}
      />
    );
  }

  return (
    <LoeysingForm
      heading="Endre løysing"
      subHeading={loeysing.namn}
      onSubmit={onSubmit}
      loeysing={loeysing}
    />
  );
};

export default LoeysingEdit;
