import { Radio } from '@digdir/design-system-react';
import { zodResolver } from '@hookform/resolvers/zod';
import SakLoeysingList from '@sak/form/steps/loeysing/forenklet/SakLoeysingList';
import SakUtvalList from '@sak/form/steps/loeysing/forenklet/SakUtvalList';
import { sakLoeysingValidationSchema } from '@sak/form/steps/sakFormValidationSchema';
import { LoeysingSource, SakFormBaseProps, SakFormState } from '@sak/types';
import React from 'react';
import { useForm, useWatch } from 'react-hook-form';

import SakFormWrapper from '../../../SakFormWrapper';

const LoeysingStepForenklet = ({
  formStepState,
  sakFormState,
  onSubmit,
}: SakFormBaseProps) => {
  const formMethods = useForm<SakFormState>({
    defaultValues: sakFormState,
    resolver: zodResolver(sakLoeysingValidationSchema),
  });

  const { control, setValue, getValues, clearErrors } = formMethods;

  const handleChangeSource = (source?: string) => {
    if (typeof source === 'undefined') {
      throw new Error('Ugyldig kilde');
    }
    const oldSource = getValues('loeysingSource');
    if (oldSource !== source) {
      clearErrors();
      setValue('loeysingSource', source as LoeysingSource);
      setValue('utval', undefined);
      setValue('loeysingList', []);
    }
  };

  const source = useWatch<SakFormState>({
    control,
    name: 'loeysingSource',
  }) as LoeysingSource;

  return (
    <SakFormWrapper
      formStepState={formStepState}
      onSubmit={onSubmit}
      formMethods={formMethods}
    >
      <div className="sak-loeysing__utval">
        <Radio.Group
          legend="Vil du bruke eit ferdig utval?"
          description="Her kan du velje å bruke eit av dei ferdige utvala, eller du kan legge inn løysingane sjølv."
          name="useUtval"
          onChange={handleChangeSource}
          value={source}
        >
          <Radio value="utval">Bruk eit utval</Radio>
          <Radio value="manuell">Velg løysingar sjølv</Radio>
        </Radio.Group>
      </div>
      {source === 'utval' && <SakUtvalList />}
      {source === 'manuell' && <SakLoeysingList />}
    </SakFormWrapper>
  );
};

export default LoeysingStepForenklet;
