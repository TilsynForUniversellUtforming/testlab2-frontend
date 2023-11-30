import TestlabForm from '@common/form/TestlabForm';
import TestlabFormButtons from '@common/form/TestlabFormButtons';
import TestlabFormHeader from '@common/form/TestlabFormHeader';
import { Paragraph } from '@digdir/design-system-react';
import React, { ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { SakFormBaseProps, SakFormState } from '../types';
import Stepper from './stepper/Stepper';

export interface Props extends Omit<SakFormBaseProps, 'sakFormState'> {
  formMethods: UseFormReturn<SakFormState>;
  hasRequiredFields?: boolean;
  heading: string;
  description?: string;
  children: ReactNode;
}

const SakFormWrapper = ({
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
      <TestlabForm<SakFormState>
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

export default SakFormWrapper;
