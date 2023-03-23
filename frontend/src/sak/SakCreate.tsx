import './sak.scss';

import React, { useCallback, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import AppTitle from '../common/app-title/AppTitle';
import { appRoutes, getFullPath, idPath } from '../common/appRoutes';
import { createMaaling } from '../maaling/api/maaling-api';
import { MaalingInit } from '../maaling/api/types';
import SakStepForm from './form/SakStepForm';
import Stepper from './form/Stepper';
import useSakForm from './hooks/useSakForm';
import { SakContext, SakFormState, sakSteps } from './types';

const SakCreate = () => {
  const navigate = useNavigate();

  const {
    regelsettList,
    loeysingList,
    setMaaling,
    contextLoading,
    setContextLoading,
    contextError,
    setContextError,
  }: SakContext = useOutletContext();

  const defaultState: SakFormState = {
    navn: '',
    loeysingList: [],
    regelsettId: undefined,
  };

  const [maalingFormState, setMaalingFormState] =
    useState<SakFormState>(defaultState);

  const doSubmitMaaling = useCallback((maalingFormState: SakFormState) => {
    setContextLoading(true);
    setContextError(undefined);

    const doCreateMaaling = async () => {
      const maalingInit: MaalingInit = {
        navn: maalingFormState.navn!,
        loeysingList: maalingFormState.loeysingList,
        // TODO - Legg til regelsett: regelsettList.find(rs => rs.id === Number(maalingFormState.regelsett))
      };

      try {
        // TODO - Bytt ut med createSak
        const maaling = await createMaaling(maalingInit);
        setMaaling(maaling);
        navigate(
          getFullPath(appRoutes.MAALING, {
            pathParam: idPath,
            id: String(maaling.id),
          })
        );
      } catch (e) {
        setContextError('Kunne ikkje lage måling');
      }
    };

    doCreateMaaling()
      .catch((e) => setContextError(e))
      .finally(() => {
        setContextLoading(false);
      });
  }, []);

  const {
    steps,
    currentStep,
    isLastStep,
    setPreviousStep,
    setNextStep,
    goToStep,
  } = useSakForm(sakSteps);

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
      <div className="sak__container">
        <div className="sak__stepper">
          <Stepper
            currentStep={currentStep}
            steps={steps}
            goToStep={goToStep}
          />
        </div>
        <div className="sak__form">
          <SakStepForm
            maalingFormState={maalingFormState}
            step={currentStep}
            loading={contextLoading}
            error={contextError}
            onClickBack={setPreviousStep}
            onSubmit={handleSubmit}
            regelsettList={regelsettList}
            loeysingList={loeysingList}
          />
        </div>
      </div>
    </>
  );
};

export default SakCreate;
