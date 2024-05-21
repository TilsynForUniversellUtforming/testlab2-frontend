import TestlabForm from '@common/form/TestlabForm';
import TestlabFormButtons from '@common/form/TestlabFormButtons';
import TestlabFormHeader from '@common/form/TestlabFormHeader';
import { Paragraph } from '@digdir/designsystemet-react';
import { FormBaseProps, MaalingFormState } from '@maaling/types';
import React, { ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';

import Stepper from './stepper/Stepper';

export interface Props extends Omit<FormBaseProps, 'maalingFormState'> {
  formMethods: UseFormReturn<MaalingFormState>;
  hasRequiredFields?: boolean;
  heading: string;
  description?: string;
  children: ReactNode;
}

const FormWrapper = ({
  formStepState,
  onSubmit,
  formMethods,
  hasRequiredFields = false,
  heading,
  description,
  children,
}: Props) => {
  return (
    <div className="sak">
      <TestlabForm<MaalingFormState>
        onSubmit={onSubmit}
        formMethods={formMethods}
        hasRequiredFields={false}
      >
        <Stepper formStepState={formStepState} />
        <div className="sak__form">
          <TestlabFormHeader heading={heading} description={description} />
          {hasRequiredFields && (
            <Paragraph spacing size="small">
              Felter markert med stjerne er obligatoriske
            </Paragraph>
          )}
          <div className="sak__container">{children}</div>
          <TestlabFormButtons step={formStepState.buttonStep} />
        </div>
      </TestlabForm>
    </div>
  );
};

export default FormWrapper;
