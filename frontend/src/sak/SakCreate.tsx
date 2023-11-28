import './sak.scss';

import toError from '@common/error/util';
import useError from '@common/hooks/useError';
import useLoading from '@common/hooks/useLoading';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { createMaaling } from '@maaling/api/maaling-api';
import { MaalingInit } from '@maaling/api/types';
import { MAALING } from '@maaling/MaalingRoutes';
import React, { useCallback, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import SakForm from './form/SakForm';
import useSakForm from './hooks/useSakForm';
import { defaultSakFormState, SakContext, SakFormState } from './types';

const SakCreate = () => {
  const navigate = useNavigate();

  const { setMaaling, contextLoading, contextError }: SakContext =
    useOutletContext();

  const [error, setError] = useError(contextError);
  const [loading, setLoading] = useLoading(contextLoading);

  const [maalingFormState, setMaalingFormState] =
    useState<SakFormState>(defaultSakFormState);

  const doCreateMaaling = async (maalingFormState: SakFormState) => {
    setLoading(true);
    setError(undefined);

    if (
      maalingFormState.navn &&
      maalingFormState.maxLenker &&
      maalingFormState.talLenker
    ) {
      const base = {
        navn: maalingFormState.navn,
        testregelIdList: maalingFormState.testregelList.map((tr) => tr.id),
        crawlParameters: {
          maxLenker: maalingFormState.maxLenker,
          talLenker: maalingFormState.talLenker,
        },
      };
      const maalingInit: MaalingInit = maalingFormState.utval
        ? { ...base, utvalId: maalingFormState.utval.id }
        : {
            ...base,
            loeysingIdList: maalingFormState.loeysingList.map(
              (l) => l.loeysing.id
            ),
          };

      try {
        const maaling = await createMaaling(maalingInit);
        setMaaling(maaling);
        navigate(
          getFullPath(MAALING, {
            pathParam: idPath,
            id: String(maaling.id),
          })
        );
      } catch (e) {
        setError(toError(e, 'Kunne ikkje oppdatere måling'));
      }
    } else {
      setError(new Error('Måling manglar parametre'));
    }
  };

  const formStepState = useSakForm('planlegging');
  const { isLastStep, setNextStep, currentStepIdx } = formStepState;

  const handleSubmit = useCallback(
    (maalingFormState: SakFormState) => {
      setMaalingFormState((prevState) => ({
        ...prevState,
        ...maalingFormState,
      }));
      if (!isLastStep(currentStepIdx)) {
        return setNextStep();
      } else {
        doCreateMaaling(maalingFormState).finally(() => {
          setLoading(false);
        });
      }
    },
    [isLastStep, setNextStep, currentStepIdx]
  );

  return (
    <SakForm
      formStepState={formStepState}
      sakFormState={maalingFormState}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
};

export default SakCreate;
