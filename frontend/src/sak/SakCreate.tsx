import './sak.scss';

import AppTitle from '@common/app-title/AppTitle';
import toError from '@common/error/util';
import useError from '@common/hooks/useError';
import useLoading from '@common/hooks/useLoading';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { createMaaling } from '@maaling/api/maaling-api';
import { MaalingInit } from '@maaling/api/types';
import { MAALING } from '@maaling/MaalingRoutes';
import React, { useCallback, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import SakStepForm from './form/SakStepForm';
import useSakForm from './hooks/useSakForm';
import { defaultSakFormState, SakContext, SakFormState } from './types';

const SakCreate = () => {
  const navigate = useNavigate();

  const {
    setMaaling,
    contextLoading,
    contextError,
    loeysingList,
    utvalList,
    verksemdList,
    regelsettList,
    advisors,
  }: SakContext = useOutletContext();

  const [error, setError] = useError(contextError);
  const [loading, setLoading] = useLoading(contextLoading);

  const [maalingFormState, setMaalingFormState] =
    useState<SakFormState>(defaultSakFormState);

  const doSubmitMaaling = useCallback((maalingFormState: SakFormState) => {
    const doCreateMaaling = async () => {
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

    doCreateMaaling().finally(() => {
      setLoading(false);
    });
  }, []);

  const formStepState = useSakForm('planlegging');
  const { isLastStep, setNextStep } = formStepState;

  const handleSubmit = useCallback(
    (maalingFormState: SakFormState) => {
      setMaalingFormState(maalingFormState);
      if (!isLastStep) {
        return setNextStep();
      } else {
        doSubmitMaaling(maalingFormState);
      }
    },
    [isLastStep, setNextStep]
  );

  return (
    <>
      <AppTitle heading="Ny sak" subHeading="Opprett ein ny sak" />
      <SakStepForm
        formStepState={formStepState}
        maalingFormState={maalingFormState}
        loeysingList={loeysingList}
        utvalList={utvalList}
        verksemdList={verksemdList}
        regelsettList={regelsettList}
        advisors={advisors}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </>
  );
};

export default SakCreate;
