import { zodResolver } from '@hookform/resolvers/zod';
import { sakLoeysingValidationSchemaForenklet } from '@maaling/form/form/steps/loeysing/sakLoeysingValidationSchemaForenklet';
import { FormBaseProps, MaalingFormState } from '@maaling/types';
import { useForm } from 'react-hook-form';

import FormWrapper from '../../FormWrapper';
import LoeysingStepForenklet from './LoeysingStepForenklet';

const LoeysingStepContainer = ({
  formStepState,
  maalingFormState,
  onSubmit,
}: FormBaseProps) => {
  const formMethods = useForm<MaalingFormState>({
    defaultValues: maalingFormState,
    resolver: zodResolver(sakLoeysingValidationSchemaForenklet),
  });

  return (
    <FormWrapper
      formStepState={formStepState}
      onSubmit={onSubmit}
      formMethods={formMethods}
      heading={formStepState.currentStep.heading}
      description={formStepState.currentStep.description}
    >
      <div className="sak-loeysing">
        <LoeysingStepForenklet />
      </div>
    </FormWrapper>
  );
};

export default LoeysingStepContainer;
