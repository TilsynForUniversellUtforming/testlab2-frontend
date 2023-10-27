import TestlabFormSelect from '@common/form/TestlabFormSelect';
import { zodResolver } from '@hookform/resolvers/zod';
import InitContentForenklet from '@sak/form/steps/init/forenklet/InitContentForenklet';
import InitContentInngaaende from '@sak/form/steps/init/inngaaende/InitContentInngaaende';
import { sakInitValidationSchema } from '@sak/form/steps/sakFormValidationSchema';
import {
  SakFormBaseProps,
  SakFormState,
  Saktype,
  saktypeOptions,
} from '@sak/types';
import React from 'react';
import { useForm, useWatch } from 'react-hook-form';

import SakStepFormWrapper from '../../SakStepFormWrapper';

const SakInitContent = ({ type }: { type?: Saktype }) => {
  if (!type) {
    return null;
  }

  if (type === 'Forenklet kontroll') {
    return <InitContentForenklet />;
  } else {
    return <InitContentInngaaende />;
  }
};

const SakInitContainer = ({
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
    <SakStepFormWrapper
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
        <SakInitContent type={type} />
      </div>
    </SakStepFormWrapper>
  );
};

export default SakInitContainer;
