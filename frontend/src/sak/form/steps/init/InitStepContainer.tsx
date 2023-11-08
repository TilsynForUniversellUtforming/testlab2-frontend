import ConditionalComponentContainer from '@common/ConditionalComponentContainer';
import TestlabFormSelect from '@common/form/TestlabFormSelect';
import { isDefined } from '@common/util/validationUtils';
import { zodResolver } from '@hookform/resolvers/zod';
import InitContentForenklet from '@sak/form/steps/init/forenklet/InitContentForenklet';
import InitContentInngaaende from '@sak/form/steps/init/inngaaende/InitContentInngaaende';
import { sakInitValidationSchema } from '@sak/form/steps/init/sakFormValidationSchema';
import {
  SakFormBaseProps,
  SakFormState,
  Saktype,
  saktypeOptions,
} from '@sak/types';
import React from 'react';
import { useForm, useWatch } from 'react-hook-form';

import SakFormWrapper from '../../SakFormWrapper';

const InitStepContainer = ({
  formStepState,
  sakFormState,
  onSubmit,
}: SakFormBaseProps) => {
  const formMethods = useForm<SakFormState>({
    defaultValues: sakFormState,
    resolver: zodResolver(sakInitValidationSchema),
  });

  const type = useWatch<SakFormState>({
    control: formMethods.control,
    name: 'sakType',
  }) as Saktype;

  return (
    <SakFormWrapper
      formStepState={formStepState}
      onSubmit={onSubmit}
      formMethods={formMethods}
      hasRequiredFields
    >
      <div className="sak-init">
        <TestlabFormSelect<SakFormState>
          label="Type sak"
          description="Angi type sak du skal opprette"
          name="sakType"
          options={saktypeOptions}
          required
        />
        <ConditionalComponentContainer
          show={isDefined(type)}
          condition={type && type === 'Forenklet kontroll'}
          conditionalComponent={<InitContentForenklet />}
          otherComponent={<InitContentInngaaende />}
        />
      </div>
    </SakFormWrapper>
  );
};

export default InitStepContainer;
