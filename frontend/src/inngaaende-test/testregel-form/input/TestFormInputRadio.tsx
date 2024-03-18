import { htmlToReactNode } from '@common/util/stringutils';
import { Radio } from '@digdir/designsystemet-react';
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
    <div className="">
      <Radio.Group
        legend={htmlToReactNode(spm)}
        value={svar ?? 'ikke_svart'} // default må være noe annet enn tom streng, pga. en bug i designsystemet
        onChange={handleValueChange}
        name={`${stegnr}-${index}`}
        description={htmlToReactNode(ht)}
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
