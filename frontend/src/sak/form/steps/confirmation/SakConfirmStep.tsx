import { Spinner } from '@digdir/design-system-react';
import React, { useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';

import ErrorCard from '../../../../common/error/ErrorCard';
import { TestlabFormButtonStep } from '../../../../common/form/TestlabFormButtons';
import { useEffectOnce } from '../../../../common/hooks/useEffectOnce';
import { isDefined } from '../../../../common/util/util';
import { TestRegelsett } from '../../../../testreglar/api/types';
import { SakFormBaseProps, SakFormState } from '../../../types';
import SakStepFormWrapper from '../../SakStepFormWrapper';
import ConfirmationAccordionList from './ConfirmationAccordionList';

interface SakConfirmContentProps {
  regelsettList: TestRegelsett[];
  error: Error | undefined;
  loading: boolean;
  maalingFormState: SakFormState;
  formErrors?: FieldErrors<SakFormState>;
}

interface Props extends SakFormBaseProps {
  regelsettList: TestRegelsett[];
  error: Error | undefined;
  loading: boolean;
}

const SakConfirmContent = ({
  error,
  loading,
  maalingFormState,
  formErrors,
}: SakConfirmContentProps) => {
  const { navn, sakType, advisor, loeysingList, testregelList } =
    maalingFormState;
  const [displaySak, setDisplaySak] = useState(true);
  const [displayLoeysingList, setDisplayLoeysingList] = useState(false);
  const [displayRegelsett, setDisplayRegelsett] = useState(false);

  const toggleDisplaySak = () => {
    setDisplaySak(!displaySak);
  };

  const toggleLoeysingList = () => {
    setDisplayLoeysingList(!displayLoeysingList);
  };

  const toggleRegelsettDisplay = () => {
    setDisplayRegelsett(!displayRegelsett);
  };

  if (loading) {
    return <Spinner title="Hentar sak" variant="default" />;
  }

  if (error) {
    return (
      <div className="sak-confirm">
        <ErrorCard error={error} />
      </div>
    );
  }

  const sakError = [formErrors?.navn, formErrors?.sakType, formErrors?.advisor]
    .map((e) => e?.message)
    .filter(isDefined)
    .join(', ');
  const loeysingError = formErrors?.loeysingList;
  const testregelError = formErrors?.testregelList;

  const sakItems = [
    {
      id: 1,
      header: 'Namn',
      text: navn ?? '',
    },
    {
      id: 2,
      header: 'Sakstype',
      text: sakType ?? '',
    },
    {
      id: 3,
      header: 'Sakshandsamar',
      text: advisor?.name ?? '',
    },
  ];

  const loeysingListItems = loeysingList.map((lo) => ({
    id: lo.loeysing.id,
    header: `Løysing: ${lo.loeysing.namn} - Ansvarleg verksemd: ${lo.verksemd.namn}`,
    text: lo.loeysing.url,
  }));

  const testregelItems =
    testregelList.map((tr) => ({
      id: tr.id,
      header: tr.kravTilSamsvar,
      text: tr?.referanseAct ?? '',
    })) ?? [];

  return (
    <div className="sak-confirm">
      <ul className="sak-confirm__list">
        <li>
          <ConfirmationAccordionList
            onToggle={toggleDisplaySak}
            open={displaySak}
            accordionHeader="Om saka"
            listItems={sakItems}
            errorMessage={sakError.length > 0 ? sakError : undefined}
          />
        </li>
        <li>
          <ConfirmationAccordionList
            onToggle={toggleLoeysingList}
            open={displayLoeysingList}
            accordionHeader="Løysingar"
            listItems={loeysingListItems}
            errorMessage={loeysingError?.message}
          />
        </li>
        <li>
          <ConfirmationAccordionList
            onToggle={toggleRegelsettDisplay}
            open={displayRegelsett}
            accordionHeader="Testreglar"
            listItems={testregelItems}
            errorMessage={testregelError?.message}
          />
        </li>
      </ul>
    </div>
  );
};

const SakConfirmStep = ({
  formStepState,
  maalingFormState,
  onSubmit,
  error,
  loading,
  regelsettList,
}: Props) => {
  const { navn, loeysingList, testregelList } = maalingFormState;
  const { onClickBack, nextStepIdx } = formStepState;

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

    if (!isDefined(loeysingList)) {
      setError('loeysingList', {
        type: 'manual',
        message: 'Løysingar må veljast',
      });
    }

    if (!isDefined(testregelList)) {
      setError('testregelList', {
        type: 'manual',
        message: 'Regelsett må veljast',
      });
    }
  };

  useEffectOnce(() => handleFormErrors());

  const handleSubmit = () => {
    if (!isDefined(errors) || typeof nextStepIdx !== 'undefined') {
      onSubmit(maalingFormState);
    }
  };

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
      />
    </SakStepFormWrapper>
  );
};

export default SakConfirmStep;
