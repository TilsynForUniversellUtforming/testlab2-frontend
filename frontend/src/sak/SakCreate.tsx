import React, { useCallback, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { appRoutes, getFullPath } from '../common/appRoutes';
import { useEffectOnce } from '../common/hooks/useEffectOnce';
import { fetchLoysingar } from '../loeysingar/api/loeysingar-api';
import { Loeysing } from '../loeysingar/api/types';
import { createMaaling } from '../maaling/api/maaling-api';
import { MaalingInit } from '../maaling/api/types';
import { getRegelsett_dummy } from '../testreglar/api/testreglar-api_dummy';
import { TestRegelsett } from '../testreglar/api/types';
import SakStepForm from './form/SakStepForm';
import Stepper from './form/Stepper';
import useSakForm from './hooks/useSakForm';
import { MaalingFormState, SakContext, sakSteps } from './types';

const SakCreate = () => {
  const defaultState: MaalingFormState = {
    navn: '',
    loeysingList: [],
    regelsett: undefined,
  };

  const navigate = useNavigate();
  const { setMaaling }: SakContext = useOutletContext();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>();
  const [loeysingList, setLoeysingList] = useState<Loeysing[]>([]);
  const [regelsettList, setRegelsettList] = useState<TestRegelsett[]>([]);
  const [maalingFormState, setMaalingFormState] =
    useState<MaalingFormState>(defaultState);

  const doSubmitMaaling = useCallback((maalingFormState: MaalingFormState) => {
    setLoading(true);
    setError(undefined);

    const doCreateMaaling = async () => {
      const maalingInit: MaalingInit = {
        navn: maalingFormState.navn!,
        loeysingList: maalingFormState.loeysingList,
      };

      try {
        const maaling = await createMaaling(maalingInit);
        setMaaling(maaling);
        navigate(getFullPath(appRoutes.SAK, String(32)));
      } catch (e) {
        setError('Kunne ikkje lage måling');
      }
    };

    doCreateMaaling()
      .catch((e) => setError(e))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const doFetchData = useCallback(() => {
    setLoading(true);
    setError(undefined);

    const doFetch = async () => {
      const loeysingList = await fetchLoysingar();
      setLoeysingList(loeysingList);

      // TODO Bytt ut med riktig kall
      const regelsett = await getRegelsett_dummy();
      setRegelsettList(regelsett);

      setLoading(false);
    };

    doFetch()
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, []);

  useEffectOnce(() => {
    doFetchData();
  });

  const {
    steps,
    currentStep,
    isLastStep,
    setPreviousStep,
    setNextStep,
    goToStep,
  } = useSakForm(sakSteps);

  const handleSubmit = (maalingFormState: MaalingFormState) => {
    setMaalingFormState(maalingFormState);
    if (!isLastStep) {
      return setNextStep();
    } else {
      doSubmitMaaling(maalingFormState);
    }
  };

  return (
    <Row>
      <Col sm={3}>
        <Stepper currentStep={currentStep} steps={steps} goToStep={goToStep} />
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
  );
};

export default SakCreate;
