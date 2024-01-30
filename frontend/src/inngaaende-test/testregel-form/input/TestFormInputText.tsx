import DebouncedInput from '@common/debounced-input/DebouncedInput';
import { Svar } from '@test/api/types';
import { StegTekst } from '@test/util/interface/Steg';
import React, { useCallback, useState } from 'react';

interface Props {
  steg: StegTekst;
  svar?: string;
  onAnswer: (answer: Svar) => void;
}

const TestFormInputText = ({ steg, svar, onAnswer }: Props) => {
  const { spm, ht, stegnr } = steg;
  const [value, setValue] = useState(svar);

  const handleValueChange = useCallback(
    (newValue?: string) => {
      setValue(newValue);
      if (typeof newValue === 'string' && newValue !== svar) {
        onAnswer({ steg: stegnr, svar: newValue });
      }
    },
    [svar, stegnr]
  );

  return (
    <DebouncedInput
      label={spm}
      description={ht}
      name={stegnr}
      type="text"
      value={value}
      onChange={handleValueChange}
      textArea={steg.multilinje}
    />
  );
};

export default TestFormInputText;
