import './sak.scss';

import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import AppTitle from '../common/app-title/AppTitle';
import { appRoutes, getFullPath, idPath } from '../common/appRoutes';
import toError from '../common/error/util';
import { createMaaling } from '../maaling/api/maaling-api';
import { MaalingInit } from '../maaling/api/types';
import SakStepFormContainer from './form/SakStepFormContainer';
import useSakForm from './hooks/useSakForm';
import { defaultSakSteps, SakContext, SakFormState } from './types';

const SakCreate = () => {
  const navigate = useNavigate();

  const {
    regelsettList,
    loeysingList,
    setMaaling,
    contextLoading,
    contextError,
  }: SakContext = useOutletContext();

  const [error, setError] = useState(contextError);
  const [loading, setLoading] = useState(contextLoading);

  const defaultState: SakFormState = {
    navn: '',
    loeysingList: [],
    regelsettId: undefined,
    maxLinksPerPage: 100,
    numLinksToSelect: 30,
  };

  const [maalingFormState, setMaalingFormState] =
    useState<SakFormState>(defaultState);

  useEffect(() => {
    setLoading(contextLoading);
    setError(contextError);
  }, [contextLoading, contextError]);

  const doSubmitMaaling = useCallback((maalingFormState: SakFormState) => {
    const doCreateMaaling = async () => {
      setLoading(true);
      setError(undefined);

      if (
        maalingFormState.navn &&
        maalingFormState.maxLinksPerPage &&
        maalingFormState.numLinksToSelect
      ) {
        const maalingInit: MaalingInit = {
          navn: maalingFormState.navn,
          loeysingIdList: maalingFormState.loeysingList.map((l) => l.id),
          crawlParameters: {
            maxLinksPerPage: maalingFormState.maxLinksPerPage,
            numLinksToSelect: maalingFormState.numLinksToSelect,
          },
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

  const {
    steps,
    currentStep,
    isLastStep,
    setPreviousStep,
    setNextStep,
    goToStep,
  } = useSakForm(defaultSakSteps);

  const handleSubmit = (maalingFormState: SakFormState) => {
    setMaalingFormState(maalingFormState);
    if (!isLastStep) {
      return setNextStep();
    } else {
      doSubmitMaaling(maalingFormState);
    }
  };

  return (
    <>
      <AppTitle heading="Ny sak" subHeading="Opprett en ny sak" />
      <SakStepFormContainer
        currentStep={currentStep}
        steps={steps}
        goToStep={goToStep}
        setPreviousStep={setPreviousStep}
        maalingFormState={maalingFormState}
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
        regelsettList={regelsettList}
        loeysingList={loeysingList}
      />
    </>
  );
};

export default SakCreate;
