import '@sak/sak.scss';

import toError from '@common/error/util';
import useError from '@common/hooks/useError';
import useLoading from '@common/hooks/useLoading';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { createMaaling } from '@maaling/api/maaling-api';
import { MaalingInit } from '@maaling/api/types';
import { MAALING } from '@maaling/MaalingRoutes';
import React, { useCallback, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import SakForm from '@sak/form/SakForm';
import useSakForm from '@sak/hooks/useSakForm';
import { MaalingContext, MaalingFormState } from '@maaling/types';

const MaalingCreate = () => {
  const navigate = useNavigate();

  const { contextLoading, contextError }: MaalingContext = useOutletContext();

  const [error, setError] = useError(contextError);
  const [loading, setLoading] = useLoading(contextLoading);

  const [sakFormState, setSakFormState] =
    useState<MaalingFormState>(defaultSakFormState);

  const doCreateMaaling = async (sakFormState: MaalingFormState) => {
    setLoading(true);
    setError(undefined);

    if (sakFormState.navn && sakFormState.maxLenker && sakFormState.talLenker) {
      const base = {
        navn: sakFormState.navn,
        testregelIdList: sakFormState.testregelList.map((tr) => tr.id),
        crawlParameters: {
          maxLenker: sakFormState.maxLenker,
          talLenker: sakFormState.talLenker,
        },
      };
      const maalingInit: MaalingInit = sakFormState.utval
        ? { ...base, utvalId: sakFormState.utval.id }
        : {
            ...base,
            loeysingIdList: sakFormState.loeysingList.map((l) => l.loeysing.id),
          };

      try {
        const maaling = await createMaaling(maalingInit);
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
    (sakFormState: MaalingFormState) => {
      setSakFormState((prevState) => ({
        ...prevState,
        ...sakFormState,
      }));

      if (sakFormState?.sakType === 'Forenklet kontroll') {
        if (!isLastStep(currentStepIdx)) {
          return setNextStep();
        } else {
          doCreateMaaling(sakFormState).finally(() => {
            setLoading(false);
          });
        }
      }
    },
    [isLastStep, setNextStep, currentStepIdx]
  );

  return (
    <SakForm
      formStepState={formStepState}
      sakFormState={sakFormState}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
};

export default MaalingCreate;
