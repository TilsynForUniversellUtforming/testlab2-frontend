import './sak.scss';

import AppTitle from '@common/app-title/AppTitle';
import { appRoutes, getFullPath, idPath } from '@common/appRoutes';
import toError from '@common/error/util';
import useError from '@common/hooks/useError';
import useLoading from '@common/hooks/useLoading';
import { createMaaling } from '@maaling/api/maaling-api';
import { MaalingInit } from '@maaling/api/types';
import React, { useCallback, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import SakStepForm from './form/SakStepForm';
import useSakForm from './hooks/useSakForm';
import { defaultSakSteps, SakContext, SakFormState } from './types';

const SakCreate = () => {
  const navigate = useNavigate();

  const { setMaaling, contextLoading, contextError }: SakContext =
    useOutletContext();

  const [error, setError] = useError(contextError);
  const [loading, setLoading] = useLoading(contextLoading);

  const defaultState: SakFormState = {
    navn: '',
    loeysingList: [],
    testregelList: [],
    maxLinksPerPage: 100,
    numLinksToSelect: 30,
    sakType: undefined,
    advisorId: undefined,
    sakNumber: '',
  };

  const [maalingFormState, setMaalingFormState] =
    useState<SakFormState>(defaultState);

  const doSubmitMaaling = useCallback((maalingFormState: SakFormState) => {
    const doCreateMaaling = async () => {
      setLoading(true);
      setError(undefined);

      if (
        maalingFormState.navn &&
        maalingFormState.maxLinksPerPage &&
        maalingFormState.numLinksToSelect
      ) {
        const base = {
          navn: maalingFormState.navn,
          testregelIdList: maalingFormState.testregelList.map((tr) => tr.id),
          crawlParameters: {
            maxLinksPerPage: maalingFormState.maxLinksPerPage,
            numLinksToSelect: maalingFormState.numLinksToSelect,
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
            getFullPath(appRoutes.MAALING, {
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

  const formStepState = useSakForm({ steps: defaultSakSteps });
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
      <AppTitle heading="Ny sak" subHeading="Opprett en ny sak" />
      <SakStepForm
        formStepState={formStepState}
        maalingFormState={maalingFormState}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </>
  );
};

export default SakCreate;
