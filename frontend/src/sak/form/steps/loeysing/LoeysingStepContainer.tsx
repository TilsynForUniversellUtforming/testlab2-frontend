import ConditionalComponentContainer from '@common/ConditionalComponentContainer';
import { isDefined, isNotDefined } from '@common/util/validationUtils';
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
  const formMethods = useForm<SakFormState>({
    defaultValues: sakFormState,
    resolver: zodResolver(
      sakFormState.sakType === 'Forenklet kontroll'
        ? sakLoeysingValidationSchemaForenklet
        : sakLoeysingValidationSchemaInngaaende
    ),
  });

  return (
    <SakFormWrapper
      formStepState={formStepState}
      onSubmit={onSubmit}
      formMethods={formMethods}
      hasRequiredFields={
        sakFormState?.sakType !== 'Forenklet kontroll' &&
        isNotDefined(sakFormState.verksemdLoeysingRelation?.loeysingList)
      }
    >
      <div className="sak-loeysing">
        <ConditionalComponentContainer
          condition={sakFormState?.sakType === 'Forenklet kontroll'}
          show={isDefined(sakFormState.sakType)}
          conditionalComponent={<LoeysingStepForenklet />}
          otherComponent={
            <LoeysingStepInngaaende
              loeysingList={sakFormState.verksemdLoeysingRelation?.loeysingList}
            />
          }
        />
      </div>
    </SakFormWrapper>
  );
};

export default LoeysingStepContainer;
