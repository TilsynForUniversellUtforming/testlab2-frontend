import DebouncedInput from '@common/debounced-input/DebouncedInput';
import { htmlToReactNode } from '@common/util/stringutils';
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
      label={htmlToReactNode(spm)}
      description={htmlToReactNode(ht)}
      name={stegnr}
      type={textFieldType}
      value={svar ?? ''}
      onChange={handleValueChange}
      textArea={steg.multilinje}
      debounce={1000}
    />
  );
};

export default TestFormInputText;
