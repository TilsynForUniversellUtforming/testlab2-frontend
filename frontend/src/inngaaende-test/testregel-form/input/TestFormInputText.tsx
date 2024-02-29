import DebouncedInput from '@common/debounced-input/DebouncedInput';
import { Svar } from '@test/api/types';
import { StegTekst } from '@test/util/testregel-interface/Steg';
import React, { useCallback } from 'react';

interface Props {
  steg: StegTekst;
  svar?: string;
  onAnswer: (answer: Svar) => void;
}

const TestFormInputText = ({ steg, svar, onAnswer }: Props) => {
  const { spm, ht, stegnr } = steg;

  const handleValueChange = useCallback(
    (newValue?: string) => {
      if (typeof newValue === 'string' && newValue !== svar) {
        onAnswer({ steg: stegnr, svar: newValue });
      }
    },
    [svar, stegnr]
  );

  const textFieldType = steg.filter === 'tal' ? 'number' : 'text';

  return (
    <DebouncedInput
      label={spm}
      description={ht}
      name={stegnr}
      type={textFieldType}
      value={svar ?? ''}
      onChange={handleValueChange}
      textArea={steg.multilinje}
    />
  );
};

export default TestFormInputText;
