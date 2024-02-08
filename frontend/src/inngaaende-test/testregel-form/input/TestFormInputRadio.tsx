import { Radio } from '@digdir/design-system-react';
import { Svar } from '@test/api/types';
import { StegJaNei, StegRadio } from '@test/util/testregel-interface/Steg';
import { useCallback, useEffect, useState } from 'react';

interface Props {
  steg: StegJaNei | StegRadio;
  svar?: string;
  onAnswer: (svar: Svar) => void;
}

const TestFormInputRadio = ({ steg, svar, onAnswer }: Props) => {
  const { spm, ht, stegnr } = steg;
  const noAnswer = 'no_answer_radio';
  const [value, setValue] = useState(noAnswer);

  const handleValueChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
      if (newValue && newValue !== svar && newValue !== noAnswer) {
        onAnswer({ steg: stegnr, svar: newValue });
      }
    },
    [svar, stegnr]
  );

  useEffect(() => {
    if (svar && svar !== value) {
      setValue(svar);
    } else if (!svar) {
      setValue(noAnswer);
    }
  }, [svar]);

  const options = steg.type === 'jaNei' ? ['Ja', 'Nei'] : steg.svarArray;

  return (
    <div className="">
      <Radio.Group
        legend={spm}
        value={value}
        onChange={handleValueChange}
        name={stegnr}
        description={ht}
      >
        {options.map((svaralternativ) => (
          <Radio value={svaralternativ} key={svaralternativ}>
            {svaralternativ}
          </Radio>
        ))}
      </Radio.Group>
    </div>
  );
};

export default TestFormInputRadio;
