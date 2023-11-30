import ConditionalComponentContainer from '@common/ConditionalComponentContainer';
import { zodResolver } from '@hookform/resolvers/zod';
import SakFormWrapper from '@sak/form/SakFormWrapper';
import LoeysingStepForenklet from '@sak/form/steps/loeysing/forenklet/LoeysingStepForenklet';
import { sakLoeysingValidationSchemaForenklet } from '@sak/form/steps/loeysing/forenklet/sakLoeysingValidationSchemaForenklet';
import LoeysingStepInngaaende from '@sak/form/steps/loeysing/inngaaende/LoeysingStepInngaaende';
import { sakLoeysingValidationSchemaInngaaende } from '@sak/form/steps/loeysing/inngaaende/sakLoeysingValidtionSchemaInngaaende';
import { SakFormBaseProps, SakFormState } from '@sak/types';
import { useForm } from 'react-hook-form';

const LoeysingStepContainer = ({
  formStepState,
  sakFormState,
  onSubmit,
}: SakFormBaseProps) => {
  const isForenkletKontroll = sakFormState?.sakType === 'Forenklet kontroll';

  const formMethods = useForm<SakFormState>({
    defaultValues: sakFormState,
    resolver: zodResolver(
      isForenkletKontroll
        ? sakLoeysingValidationSchemaForenklet
        : sakLoeysingValidationSchemaInngaaende
    ),
  });

  const loeysingList =
    sakFormState.verksemdLoeysingRelation?.loeysingList.filter(
      (loeysing) => loeysing.useInTest
    );

  return (
    <SakFormWrapper
      formStepState={formStepState}
      onSubmit={onSubmit}
      formMethods={formMethods}
      heading={
        isForenkletKontroll ? formStepState.currentStep.heading : 'Opprett sak'
      }
      description={
        isForenkletKontroll ? formStepState.currentStep.description : ''
      }
    >
      <div className="sak-loeysing">
        <ConditionalComponentContainer
          condition={isForenkletKontroll}
          conditionalComponent={<LoeysingStepForenklet />}
          otherComponent={
            <LoeysingStepInngaaende
              loeysingNettsideRelationList={loeysingList}
            />
          }
        />
      </div>
    </SakFormWrapper>
  );
};

export default LoeysingStepContainer;
