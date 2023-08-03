import { utval } from '@common/appRoutes';
import { TestlabFormButtonStep } from '@common/form/TestlabFormButtons';
import { useEffectOnce } from '@common/hooks/useEffectOnce';
import { isDefined } from '@common/util/util';
import { SakFormBaseProps, SakFormState } from '@sak/types';
import React from 'react';
import { useForm } from 'react-hook-form';

import { TestRegelsett } from '../../../../testreglar/api/types';
import { User } from '../../../../user/api/types';
import SakStepFormWrapper from '../../SakStepFormWrapper';
import SakConfirmContent from './SakConfirmContent';

interface Props extends SakFormBaseProps {
  error: Error | undefined;
  loading: boolean;
  regelsettList: TestRegelsett[];
  advisors: User[];
}

const SakConfirmStep = ({
  formStepState,
  maalingFormState,
  regelsettList,
  advisors,
  onSubmit,
  error,
  loading,
}: Props) => {
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
