import ConditionalComponentContainer from '@common/ConditionalComponentContainer';
import { isDefined } from '@common/util/validationUtils';
import { Radio } from '@digdir/design-system-react';
import SakLoeysingList from '@sak/form/steps/loeysing/forenklet/SakLoeysingList';
import SakUtvalList from '@sak/form/steps/loeysing/forenklet/SakUtvalList';
import { LoeysingSource, SakFormState } from '@sak/types';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

const LoeysingStepForenklet = () => {
  const { control, setValue, getValues, clearErrors } =
    useFormContext<SakFormState>();

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
    <>
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
      <ConditionalComponentContainer
        condition={source === 'utval'}
        show={isDefined(source)}
        conditionalComponent={<SakUtvalList />}
        otherComponent={<SakLoeysingList />}
      />
    </>
  );
};

export default LoeysingStepForenklet;
