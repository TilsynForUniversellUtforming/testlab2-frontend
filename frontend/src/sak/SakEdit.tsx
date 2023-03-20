import React, { useCallback, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import AppTitle from '../common/app-title/AppTitle';
import { appRoutes, getFullPath, idPath } from '../common/appRoutes';
import { updateMaaling } from '../maaling/api/maaling-api';
import { MaalingEdit } from '../maaling/api/types';
import SakStepForm from './form/SakStepForm';
import Stepper from './form/Stepper';
import useSakForm from './hooks/useSakForm';
import { SakContext, SakFormState, sakSteps } from './types';

const SakEdit = () => {
  const navigate = useNavigate();

  const {
    maaling,
    regelsettList,
    loeysingList,
    setMaaling,
    contextLoading,
    setContextLoading,
    contextError,
    setContextError,
  }: SakContext = useOutletContext();

  const defaultState: SakFormState = {
    navn: maaling?.navn ?? '',
    loeysingList: maaling?.loeysingList ?? [],
    regelsett: undefined,
  };

  const [maalingFormState, setMaalingFormState] =
    useState<SakFormState>(defaultState);

  const doSubmitMaaling = useCallback((maalingFormState: SakFormState) => {
    setContextLoading(true);
    setContextError(undefined);

    const doEditMaaling = async () => {
      if (maaling) {
        const maalingEdit: MaalingEdit = {
          id: maaling.id,
          navn: maalingFormState.navn!,
          loeysingList: maalingFormState.loeysingList,
        };

        try {
          // TODO - Bytt ut med updateSak
          const maaling = await updateMaaling(maalingEdit);
          setMaaling(maaling);
          navigate(
            getFullPath(appRoutes.SAK, {
              pathParam: idPath,
              id: String(maaling.id),
            })
          );
        } catch (e) {
          setContextError('Kunne ikkje lage sak');
        }
      } else {
        setContextError('Kunne ikkje oppdatere sak');
      }
    };

    doEditMaaling()
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
      <AppTitle title="Endre sak" />
      <div>
        {/*sm={3}*/}
        <div>
          <Stepper
            currentStep={currentStep}
            steps={steps}
            goToStep={goToStep}
          />
        </div>
        {/*sm={9}*/}
        <div>
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

export default SakEdit;
