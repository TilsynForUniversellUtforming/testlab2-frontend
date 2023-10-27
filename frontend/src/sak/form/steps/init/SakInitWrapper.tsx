import TestlabFormSelect from '@common/form/TestlabFormSelect';
import { zodResolver } from '@hookform/resolvers/zod';
import InitContentForenklet from '@sak/form/steps/init/forenklet/InitContentForenklet';
import InitContentIngaaende from '@sak/form/steps/init/ingaaende/InitContentIngaaende';
import { sakInitValidationSchema } from '@sak/form/steps/sakFormValidationSchema';
import {
  SakFormBaseProps,
  SakFormState,
  Saktype,
  saktypeOptions,
} from '@sak/types';
import React from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { User } from '../../../../user/api/types';
import SakStepFormWrapper from '../../SakStepFormWrapper';

interface Props extends SakFormBaseProps {
  advisors: User[];
}

const SakInitWrapper = ({
  formStepState,
  sakFormState,
  advisors,
  onSubmit,
}: Props) => {
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
          sublabel="Angi type sak du skal opprette"
          name="sakType"
          options={saktypeOptions}
          required
        />
        {type && type === 'Forenklet kontroll' && (
          <InitContentForenklet advisors={advisors} />
        )}
        {type && type !== 'Forenklet kontroll' && <InitContentIngaaende />}
      </div>
    </SakStepFormWrapper>
  );
};

export default SakInitWrapper;
