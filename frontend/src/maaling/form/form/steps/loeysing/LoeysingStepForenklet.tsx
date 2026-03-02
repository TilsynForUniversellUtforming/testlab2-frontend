import ConditionalComponentContainer from '@common/ConditionalComponentContainer';
import { isDefined } from '@common/util/validationUtils';
import { Field, Fieldset, Radio } from '@digdir/designsystemet-react';
import MaalingLoeysingList from '@maaling/form/form/steps/loeysing/MaalingLoeysingList';
import UtvalList from '@maaling/form/form/steps/loeysing/UtvalList';
import { LoeysingSource, MaalingFormState } from '@maaling/types';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

const LoeysingStepForenklet = () => {
  const { control, setValue, getValues, clearErrors } =
    useFormContext<MaalingFormState>();

  const handleChangeSource = (source?: string) => {
    if (typeof source === 'undefined') {
      throw new TypeError('Ugyldig kilde');
    }
    const oldSource = getValues('loeysingSource');
    if (oldSource !== source) {
      clearErrors();
      setValue('loeysingSource', source as LoeysingSource);
      setValue('utval', undefined);
      setValue('loeysingList', []);
    }
  };

  const source = useWatch<MaalingFormState>({
    control,
    name: 'loeysingSource',
  }) as LoeysingSource;

  return (
    <>
      <div className="sak-loeysing__utval">
        <Fieldset>
          <Fieldset.Legend>Vil du bruke eit ferdig utval?</Fieldset.Legend>
          <Fieldset.Description>Her kan du velje å bruke eit av dei ferdige utvala, eller du kan legge inn løysingane sjølv."</Fieldset.Description>
          <Radio value="utval" label="Bruk eit utval" onClick={()=>handleChangeSource}/>
          <Radio value="manuell" label="Velg løysingar sjølv" />
        </Fieldset>
      </div>
      <ConditionalComponentContainer
        condition={source === 'utval'}
        show={isDefined(source)}
        conditionalComponent={<UtvalList />}
        otherComponent={<MaalingLoeysingList />}
      />
    </>
  );
};

export default LoeysingStepForenklet;
