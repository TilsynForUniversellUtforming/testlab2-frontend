import { ErrorMessage } from '@digdir/design-system-react';
import React, { useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';

import ErrorCard from '../../../../common/error/ErrorCard';
import { TestlabFormButtonStep } from '../../../../common/form/TestlabFormButtons';
import { useEffectOnce } from '../../../../common/hooks/useEffectOnce';
import { isDefined } from '../../../../common/util/util';
import { TestRegelsett } from '../../../../testreglar/api/types';
import { SakFormBaseProps, SakFormState } from '../../../types';
import SakFormContainer from '../../SakFormContainer';
import ConfirmationAccordionList from './ConfirmationAccordionList';

interface SakConfirmContentProps {
  regelsettList: TestRegelsett[];
  error: any;
  loading: boolean;
  maalingFormState: SakFormState;
  formErrors?: FieldErrors<SakFormState>;
}

interface Props extends SakFormBaseProps {
  regelsettList: TestRegelsett[];
  error: any;
  loading: boolean;
  onClickBack: () => void;
}

const SakConfirmContent = ({
  regelsettList,
  error,
  loading,
  maalingFormState,
  formErrors,
}: SakConfirmContentProps) => {
  const { navn, loeysingList, regelsettId } = maalingFormState;
  const [displayLoeysingList, setDisplayLoeysingList] = useState(false);
  const [displayRegelsett, setDisplayRegelsett] = useState(false);

  const toggleLoesyingList = () => {
    setDisplayLoeysingList(!displayLoeysingList);
  };

  const toggleRegelsettDisplay = () => {
    setDisplayRegelsett(!displayRegelsett);
  };

  if (loading) {
    return <span>SPINNER</span>;
  }

  if (error) {
    return <ErrorCard show errorText={error} />;
  }

  const navnError = formErrors?.navn;
  const loeysingError = formErrors?.loeysingList;
  const regelsettError = formErrors?.regelsettId;
  const selectedRegeslett = regelsettList.find(
    (rs) => rs.id === Number(regelsettId)
  );

  const loesysingListItems = loeysingList.map((lo) => ({
    id: lo.id,
    header: lo.namn,
    text: lo.url,
  }));

  const regelsettListItems =
    selectedRegeslett?.testregelList.map((tr) => ({
      id: tr.id,
      header: tr.kravTilSamsvar,
      text: tr?.referanseAct ?? '',
    })) ?? [];

  return (
    <div className="sak-confirm">
      <ul className="sak-confirm__list">
        <li>
          <h4 className="sak-confirm__header">Namn</h4>
          <div className="sak-confirm__muted">{navn}</div>
          {navnError && <ErrorMessage>{navnError?.message}</ErrorMessage>}
        </li>
        <li>
          <ConfirmationAccordionList
            onToggle={toggleLoesyingList}
            open={displayLoeysingList}
            accordionHeader="Valgte løysingar"
            subtitle={`(${loeysingList.length})`}
            listItems={loesysingListItems}
            errorMessage={loeysingError?.message}
          />
        </li>
        <li>
          <ConfirmationAccordionList
            onToggle={toggleRegelsettDisplay}
            open={displayRegelsett}
            accordionHeader="Valgte regelsett"
            subtitle={`${selectedRegeslett?.namn} (${selectedRegeslett?.testregelList.length})`}
            listItems={regelsettListItems}
            errorMessage={regelsettError?.message}
          />
        </li>
      </ul>
    </div>
  );
};

const SakConfirmStep = ({
  heading,
  maalingFormState,
  onSubmit,
  onClickBack,
  error,
  loading,
  regelsettList,
}: Props) => {
  const { navn, loeysingList, regelsettId } = maalingFormState;

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

    if (!isDefined(regelsettId)) {
      setError('regelsettId', {
        type: 'manual',
        message: 'Regelsett må veljast',
      });
    }
  };

  useEffectOnce(() => handleFormErrors());

  const handleSubmit = () => {
    if (!isDefined(errors)) {
      onSubmit(maalingFormState);
    }
  };

  const buttonStep: TestlabFormButtonStep = {
    stepType: 'Submit',
    onClickBack: onClickBack,
  };

  return (
    <SakFormContainer
      heading={heading}
      formMethods={formMethods}
      onSubmit={handleSubmit}
      buttonStep={buttonStep}
    >
      <SakConfirmContent
        regelsettList={regelsettList}
        maalingFormState={maalingFormState}
        error={error}
        loading={loading}
        formErrors={errors}
      />
    </SakFormContainer>
  );
};

export default SakConfirmStep;
