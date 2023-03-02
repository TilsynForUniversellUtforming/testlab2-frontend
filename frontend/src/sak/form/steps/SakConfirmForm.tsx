import React from 'react';
import { Accordion, ListGroup, Spinner, Stack } from 'react-bootstrap';
import { FieldErrors, useForm } from 'react-hook-form';

import ErrorCard from '../../../common/error/ErrorCard';
import { TestlabFormButtonStep } from '../../../common/form/TestlabFormButtons';
import { useEffectOnce } from '../../../common/hooks/useEffectOnce';
import { isDefined } from '../../../common/util/util';
import { MaalingFormState, SakFormBaseProps } from '../../types';
import SakFormContainer from '../SakFormContainer';

interface SakConfirmContentProps {
  error: any;
  loading: boolean;
  maalingFormState: MaalingFormState;
  formErrors?: FieldErrors<MaalingFormState>;
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

  if (loading) {
    return <Spinner />;
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
    <Stack gap={5}>
      <div>
        <h4>Namn</h4>
        <div>{navn}</div>
        {navnError && (
          <div className="invalid-feedback d-block">{navnError?.message}</div>
        )}
      </div>
      <div>
        <h4>Valgte løysingar</h4>
        <ListGroup as="ol" className="w-50 ">
          {loeysingList.map((lo) => (
            <ListGroup.Item key={lo.id} as="li">
              <div className="fw-bold">{lo.namn}</div>
              {lo.url}
            </ListGroup.Item>
          ))}
        </ListGroup>
        {loeysingError && (
          <div className="invalid-feedback d-block">
            {loeysingError?.message}
          </div>
        )}
      </div>
      <div>
        <h4>Regelsett</h4>
        {showRegelsett && (
          <Accordion className="w-50">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                {regelsett.namn} ({regelsett.testregelList.length})
              </Accordion.Header>
              <Accordion.Body>
                <ListGroup>
                  {regelsett.testregelList.map((tr) => (
                    <ListGroup.Item key={tr.id} as="li">
                      <div className="fw-bold">{tr.kravTilSamsvar}</div>
                      {tr.referanseAct}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        )}
        {regelsettError && (
          <div className="invalid-feedback d-block">
            {regelsettError?.message}
          </div>
        )}
      </div>
    </Stack>
  );
};

const SakConfirmForm = ({
  heading,
  maalingFormState,
  onSubmit,
  onClickBack,
  error,
  loading,
}: Props) => {
  const { navn, loeysingList, regelsett } = maalingFormState;

  const formMethods = useForm<MaalingFormState>({
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

export default SakConfirmForm;
