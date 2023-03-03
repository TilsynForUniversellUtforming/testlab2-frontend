import React, { useCallback, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useNavigate, useOutletContext } from 'react-router-dom';

import AppTitle from '../common/app-title/AppTitle';
import { appRoutes, getFullPath } from '../common/appRoutes';
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
    loading,
    setLoading,
    error,
    setContextError,
  }: SakContext = useOutletContext();

  const defaultState: SakFormState = {
    navn: '',
    loeysingList: [],
    regelsett: undefined,
  };

  const [maalingFormState, setMaalingFormState] =
    useState<SakFormState>(defaultState);

  const doSubmitMaaling = useCallback((maalingFormState: SakFormState) => {
    setLoading(true);
    setContextError(undefined);

    const doCreateMaaling = async () => {
      const maalingInit: MaalingInit = {
        navn: maalingFormState.navn!,
        loeysingList: maalingFormState.loeysingList,
      };

      try {
        // TODO - Bytt ut med createSak
        const maaling = await createMaaling(maalingInit);
        setMaaling(maaling);
        navigate(getFullPath(appRoutes.SAK, String(maaling.id)));
      } catch (e) {
        setContextError('Kunne ikkje lage måling');
      }
    };

    doCreateMaaling()
      .catch((e) => setContextError(e))
      .finally(() => {
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
      <AppTitle title="Ny sak" subTitle="Opprett en ny sak" />
      <Row>
        <Col sm={3}>
          <Stepper
            currentStep={currentStep}
            steps={steps}
            goToStep={goToStep}
          />
        </Col>
        <Col sm={9}>
          <SakStepForm
            maalingFormState={maalingFormState}
            step={currentStep}
            loading={loading}
            error={error}
            onClickBack={setPreviousStep}
            onSubmit={handleSubmit}
            regelsettList={regelsettList}
            loeysingList={loeysingList}
          />
        </Col>
      </Row>
    </>
  );
};

export default SakCreate;
