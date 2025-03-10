import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import toError from '@common/error/util';
import useError from '@common/hooks/useError';
import useLoading from '@common/hooks/useLoading';
import { updateMaaling } from '@maaling/api/maaling-api';
import { MaalingEditParams } from '@maaling/api/types';
import MaalingForm from '@maaling/form/form/MaalingForm';
import useMaalingForm from '@maaling/hooks/hooks/useMaalingForm';
import useMaalingFormState from '@maaling/hooks/hooks/useMaalingFormState';
import { MaalingContext, MaalingFormState } from '@maaling/types';
import React, { useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';

interface Props {
  onChangeTabs: (tab: string) => void;
}

const MaalingEdit = ({ onChangeTabs }: Props) => {
  const {
    maaling,
    verksemdList,
    advisors,
    setMaaling,
    loadingMaaling,
    contextError,
  }: MaalingContext = useOutletContext();

  const [error, setError] = useError(contextError);
  const [alert, setAlert] = useAlert();
  const [loading, setLoading] = useLoading(loadingMaaling);
  const [maalingFormState, setMaalingFormState] = useMaalingFormState(
    maaling,
    verksemdList,
    advisors
  );

  const doSubmitMaaling = useCallback(
    (maalingFormState: MaalingFormState) => {
      setLoading(true);
      setError(undefined);

      const doEditMaaling = async () => {
        if (maaling) {
          const maalingEdit: MaalingEditParams = {
            id: maaling.id,
            navn: maalingFormState.navn!,
            loeysingIdList: maalingFormState.loeysingList.map(
              (l) => l.loeysing.id
            ),
            testregelIdList: maalingFormState.testregelList.map((tr) => tr.id),
            crawlParameters: {
              maxLenker: maalingFormState.maxLenker,
              talLenker: maalingFormState.talLenker,
            },
          };

          try {
            const maaling = await updateMaaling(maalingEdit);
            setMaaling(maaling);
            setAlert('success', `${maalingEdit.navn} er oppdatert`);
          } catch (e) {
            setError(toError(e, 'Kunne ikkje lage sak'));
          }
        } else {
          setError(new Error('Kunne ikkje oppdatere sak'));
        }
      };

      doEditMaaling().finally(() => {
        setLoading(false);
        onChangeTabs('oversikt');
      });
    },
    [maaling]
  );

  const formStepState = useMaalingForm(maaling?.status, true);
  const { isLastStep, setNextStep, currentStepIdx } = formStepState;

  const handleSubmit = useCallback(
    (maalingFormState: MaalingFormState) => {
      setMaalingFormState((prevState) => ({
        ...prevState,
        ...maalingFormState,
      }));
      if (!isLastStep(currentStepIdx)) {
        return setNextStep();
      } else {
        doSubmitMaaling(maalingFormState);
      }
    },
    [isLastStep, setNextStep, currentStepIdx]
  );

  return (
    <>
      <MaalingForm
        formStepState={formStepState}
        maalingFormState={maalingFormState}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
      {alert && (
        <AlertTimed
          severity={alert.severity}
          message={alert.message}
          clearMessage={alert.clearMessage}
        />
      )}
    </>
  );
};

export default MaalingEdit;
