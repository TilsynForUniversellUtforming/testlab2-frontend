import React, { useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';

import ErrorCard from '../../../common/error/ErrorCard';
import { TestlabFormButtonStep } from '../../../common/form/TestlabFormButtons';
import { useEffectOnce } from '../../../common/hooks/useEffectOnce';
import { isDefined } from '../../../common/util/util';
import { SakFormBaseProps, SakFormState } from '../../types';
import SakFormContainer from '../SakFormContainer';

interface SakConfirmContentProps {
  error: any;
  loading: boolean;
  maalingFormState: SakFormState;
  formErrors?: FieldErrors<SakFormState>;
}

interface Props extends SakFormBaseProps {
  error: any;
  loading: boolean;
  onClickBack: () => void;
}

const SakConfirmContent = ({
  error,
  loading,
  maalingFormState,
  formErrors,
}: SakConfirmContentProps) => {
  const { navn, loeysingList, regelsett } = maalingFormState;
  const [displayRegelsett, setDisplayRegelsett] = useState(false);

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
  const regelsettError = formErrors?.regelsett;
  const showRegelsett =
    typeof regelsett?.testregelList !== 'undefined' &&
    (regelsett?.testregelList?.length ?? 0) > 0;

  return (
    <ul>
      <li>
        <h4>Namn</h4>
        <div>{navn}</div>
        {navnError && (
          <div className="invalid-feedback d-block">{navnError?.message}</div>
        )}
      </li>
      <li>
        <h4>Valgte løysingar</h4>
        <ol className="w-50 ">
          {loeysingList.map((lo) => (
            <li key={lo.id}>
              <div className="fw-bold">{lo.namn}</div>
              {lo.url}
            </li>
          ))}
        </ol>
        {loeysingError && (
          <div className="invalid-feedback d-block">
            {loeysingError?.message}
          </div>
        )}
      </li>
      <li>
        <h4>Regelsett</h4>
        {showRegelsett && (
          <div className="w-50">
            <div>
              <button onClick={toggleRegelsettDisplay}>
                {regelsett.namn} ({regelsett.testregelList.length})
              </button>
              <div>
                <ul>
                  {regelsett.testregelList.map((tr) => (
                    <li key={tr.id}>
                      <div className="fw-bold">{tr.kravTilSamsvar}</div>
                      {tr.referanseAct}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        {regelsettError && (
          <div className="invalid-feedback d-block">
            {regelsettError?.message}
          </div>
        )}
      </li>
    </ul>
  );
};

const SakConfirmStep = ({
  heading,
  maalingFormState,
  onSubmit,
  onClickBack,
  error,
  loading,
}: Props) => {
  const { navn, loeysingList, regelsett } = maalingFormState;

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

    if (!isDefined(regelsett)) {
      setError('regelsett', {
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
        maalingFormState={maalingFormState}
        error={error}
        loading={loading}
        formErrors={errors}
      />
    </SakFormContainer>
  );
};

export default SakConfirmStep;
