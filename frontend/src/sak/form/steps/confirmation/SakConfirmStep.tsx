import { utval } from '@common/appRoutes';
import { TestlabFormButtonStep } from '@common/form/TestlabFormButtons';
import { useEffectOnce } from '@common/hooks/useEffectOnce';
import { isDefined } from '@common/util/util';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';

import { TestRegelsett } from '../../../../testreglar/api/types';
import { SakContext, SakFormBaseProps, SakFormState } from '../../../types';
import SakStepFormWrapper from '../../SakStepFormWrapper';
import SakConfirmContent from './SakConfirmContent';

interface Props extends SakFormBaseProps {
  regelsettList: TestRegelsett[];
  error: Error | undefined;
  loading: boolean;
}

const SakConfirmStep = ({
  formStepState,
  maalingFormState,
  onSubmit,
  error,
  loading,
  regelsettList,
}: Props) => {
  const { advisors }: SakContext = useOutletContext();
  const { navn, loeysingList, testregelList } = maalingFormState;
  const { onClickBack } = formStepState;

  const formMethods = useForm<SakFormState>({
    defaultValues: maalingFormState,
  });

  const {
    setError,
    clearErrors,
    formState: { errors },
  } = formMethods;

  const handleFormErrors = () => {
    clearErrors();

    if (!isDefined(navn)) {
      setError('navn', {
        type: 'manual',
        message: 'Namn må gis',
      });
    }

    if (!isDefined(loeysingList) && !isDefined(utval)) {
      setError('loeysingList', {
        type: 'manual',
        message: 'Løysingar må veljast',
      });
    }

    if (!isDefined(testregelList)) {
      setError('testregelList', {
        type: 'manual',
        message: 'Testreglar må veljast',
      });
    }
  };

  useEffectOnce(() => handleFormErrors());

  const buttonStep: TestlabFormButtonStep = {
    stepType: 'Submit',
    onClickBack: onClickBack,
  };

  return (
    <SakStepFormWrapper
      formStepState={formStepState}
      onSubmit={onSubmit}
      formMethods={formMethods}
      buttonStep={buttonStep}
    >
      <SakConfirmContent
        regelsettList={regelsettList}
        maalingFormState={maalingFormState}
        error={error}
        loading={loading}
        formErrors={errors}
        advisors={advisors}
      />
    </SakStepFormWrapper>
  );
};

export default SakConfirmStep;
