import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { TestlabFormButtonStep } from '../../../common/form/TestlabFormButtons';
import TestlabFormInput from '../../../common/form/TestlabFormInput';
import TestlabFormSelect from '../../../common/form/TestlabFormSelect';
import { SakFormBaseProps, SakFormState } from '../../types';
import SakStepFormWrapper from '../SakStepFormWrapper';

const SakInitStep = ({
  formStepState,
  maalingFormState,
  onSubmit,
}: SakFormBaseProps) => {
  const navigate = useNavigate();

  const formMethods = useForm<SakFormState>({
    defaultValues: maalingFormState,
  });

  const buttonStep: TestlabFormButtonStep = {
    stepType: 'Start',
    onClickBack: () => navigate('/'),
  };

  return (
    <SakStepFormWrapper
      formStepState={formStepState}
      onSubmit={onSubmit}
      formMethods={formMethods}
      buttonStep={buttonStep}
    >
      <div className="sak-init">
        <TestlabFormSelect<SakFormState>
          label="Type sak"
          name="sakType"
          options={[
            { label: 'Dispensasjonssøknad', value: 'Dispensasjonssøknad' },
            { label: 'IKT-fagleg uttale', value: 'IKT-fagleg uttale' },
            { label: 'Forenklet kontroll', value: 'Forenklet kontroll' },
            { label: 'Statusmåling', value: 'Statusmåling' },
            { label: 'Tilsyn', value: 'Tilsyn' },
            { label: 'Anna', value: 'Anna' },
          ]}
          formValidation={{
            errorMessage: 'Type sak må vejast',
            validation: { required: true },
          }}
        />
        <TestlabFormInput<SakFormState>
          label="Tittel"
          name="navn"
          formValidation={{
            errorMessage: 'Tittel kan ikkje væra tom',
            validation: { required: true, minLength: 1 },
          }}
        />
        <TestlabFormInput<SakFormState>
          label="Sakshandsamar"
          name="advisor"
          formValidation={{
            errorMessage: 'Sakshandsamar kan ikkje væra tom',
            validation: { required: true, minLength: 1 },
          }}
        />
        <TestlabFormInput<SakFormState>
          label="Saksnummer (valfritt)"
          name="sakNumber"
        />
      </div>
    </SakStepFormWrapper>
  );
};

export default SakInitStep;
