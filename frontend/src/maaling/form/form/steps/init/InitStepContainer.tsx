import TestlabFormSelect from '@common/form/TestlabFormSelect';
import { zodResolver } from '@hookform/resolvers/zod';
import { sakInitValidationSchema } from '@maaling/form/form/steps/init/sakFormValidationSchema';
import {
  FormBaseProps,
  MaalingFormState,
  maalingTypeOptions,
} from '@maaling/types';
import React from 'react';
import { Resolver, useForm } from 'react-hook-form';

import FormWrapper from '../../FormWrapper';
import InitContentForenklet from './InitContentForenklet';

const InitStepContainer = ({
  formStepState,
  maalingFormState,
  onSubmit,
}: FormBaseProps) => {
  const formMethods = useForm<MaalingFormState>({
    defaultValues: maalingFormState,
    // `sakInitValidationSchema` only validates a subset of `MaalingFormState`
    // (the fields relevant to this wizard step), so its inferred Zod type is
    // narrower than the full form state. The resolver is cast here since the
    // actual form values are always the complete `MaalingFormState`, shared
    // across all steps of the wizard.
    resolver: zodResolver(
      sakInitValidationSchema
    ) as unknown as Resolver<MaalingFormState>,
  });

  return (
    <FormWrapper
      formStepState={formStepState}
      onSubmit={onSubmit}
      formMethods={formMethods}
      heading={formStepState.currentStep.heading}
      description={formStepState.currentStep.description}
      hasRequiredFields
    >
      <div className="sak-init">
        <TestlabFormSelect<MaalingFormState>
          label="Type sak"
          description="Angi type sak du skal opprette"
          name="sakType"
          options={maalingTypeOptions}
          required
        />
        <InitContentForenklet />
      </div>
    </FormWrapper>
  );
};

export default InitStepContainer;
