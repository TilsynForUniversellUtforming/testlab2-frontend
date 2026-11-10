import { htmlToReactNode } from '@common/util/stringutils';
import { Fieldset, Radio, useRadioGroup, ValidationMessage } from '@digdir/designsystemet-react';
import { Svar } from '@test/api/types';
import { StegJaNei, StegRadio } from '@test/util/testregel-interface/Steg';
import React, { useEffect } from 'react';

interface Props {
  steg: StegJaNei | StegRadio;
  svar?: string;
  index: number;
  onAnswer: (svar: Svar) => void;
}

const TestFormInputRadio = ({ steg, svar, index, onAnswer }: Props) => {
  const { spm, ht, stegnr } = steg;

  const handleValueChange = (newValue: string) => {
    onAnswer({ steg: stegnr, svar: newValue });
  };

  const options = steg.type === 'jaNei' ? ['Ja', 'Nei'] : steg.svarArray;

  const { getRadioProps, validationMessageProps, setValue } = useRadioGroup({
    name: `${stegnr}-${index}`,
    value: svar ?? '',
    onChange: (nextValue) => {
      handleValueChange(nextValue);
    },
  });

  useEffect(() => {
    setValue(svar ?? '');
  }, [svar, setValue]);

  return (
    <div>
      <Fieldset>
        <Fieldset.Legend>{htmlToReactNode(spm)}</Fieldset.Legend>
        {htmlToReactNode(ht)}
        {options.map((svaralternativ) => (
          <Radio
            {...getRadioProps({ value: svaralternativ })}
            key={svaralternativ}
            label={svaralternativ}
          >
            {svaralternativ}
          </Radio>
        ))}
        <ValidationMessage {...validationMessageProps} />
      </Fieldset>
    </div>
  );
};

export default TestFormInputRadio;
