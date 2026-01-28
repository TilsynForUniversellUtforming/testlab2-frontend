import { htmlToReactNode } from '@common/util/stringutils';
import { Fieldset, Radio } from '@digdir/designsystemet-react';
import { Svar } from '@test/api/types';
import { StegJaNei, StegRadio } from '@test/util/testregel-interface/Steg';

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

  return (
    <div>
      <Fieldset
      >
        <Fieldset.Legend>
          {htmlToReactNode(spm)}
        </Fieldset.Legend>
        {htmlToReactNode(ht)}
        {options.map((svaralternativ) => (
          <Radio name={`${stegnr}-${index}`} value={svaralternativ} key={svaralternativ} label={svaralternativ} onChange={(value) => handleValueChange(svaralternativ)}>
            {svaralternativ}
          </Radio>
        ))}
      </Fieldset>
    </div>
  );
};

export default TestFormInputRadio;
