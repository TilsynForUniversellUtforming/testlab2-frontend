import { Accordion, Spinner } from '@digdir/design-system-react';
import React from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';

import ErrorCard from '../../../../common/error/ErrorCard';
import { TestlabFormButtonStep } from '../../../../common/form/TestlabFormButtons';
import { useEffectOnce } from '../../../../common/hooks/useEffectOnce';
import { isDefined } from '../../../../common/util/util';
import { TestRegelsett } from '../../../../testreglar/api/types';
import { SakContext, SakFormBaseProps, SakFormState } from '../../../types';
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
  const { advisors }: SakContext = useOutletContext();
  const { navn, sakType, sakNumber, advisor, loeysingList, testregelList } =
    maalingFormState;

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
  const advisorName =
    advisors.find((a) => a.id === Number(advisor))?.name ?? '';

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
      text: advisorName,
    },
  ];

  if (sakNumber) {
    sakItems.push({
      id: 4,
      header: 'Saksnummer',
      text: sakNumber,
    });
  }

  const loeysingListItems = loeysingList.map((lo) => ({
    id: lo.loeysing.id,
    header: `Løysing: ${lo.loeysing.namn} - Ansvarleg verksemd: ${lo.verksemd.namn}`,
    text: lo.loeysing.url,
  }));

  const testregelItems =
    testregelList.map((tr) => ({
      id: tr.id,
      header: tr.kravTilSamsvar,
      text: tr?.testregelNoekkel ?? '',
    })) ?? [];

  return (
    <div className="sak-confirm">
      <Accordion color="neutral">
        <ConfirmationAccordionList
          open
          hideNumbering
          accordionHeader="Om saka"
          listItems={sakItems}
          errorMessage={sakError.length > 0 ? sakError : undefined}
        />

        <ConfirmationAccordionList
          accordionHeader="Løysingar"
          listItems={loeysingListItems}
          errorMessage={loeysingError?.message}
        />

        <ConfirmationAccordionList
          accordionHeader="Testreglar"
          listItems={testregelItems}
          errorMessage={testregelError?.message}
        />
      </Accordion>
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

    if (!isDefined(loeysingList)) {
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
      />
    </SakStepFormWrapper>
  );
};

export default SakConfirmStep;
