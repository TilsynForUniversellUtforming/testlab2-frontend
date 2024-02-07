import { ErrorMessage } from '@digdir/design-system-react';
import { Svar } from '@test/api/types';
import TestFormDescription from '@test/testregel-form/input/TestFormDescription';
import TestFormInputRadio from '@test/testregel-form/input/TestFormInputRadio';
import TestFormInputText from '@test/testregel-form/input/TestFormInputText';
import { SelectionOutcome } from '@test/types';
import { Steg } from '@test/util/interface/Steg';
import {
  AlleSvar,
  finnSvar,
  parseHtmlEntities,
} from '@test/util/testregelParser';

interface FormStepProps {
  steg: Steg | undefined;
  alleSvar: AlleSvar;
  onAnswer: (answer: Svar, selectionOutcome?: SelectionOutcome) => void;
}

const TestFormStepWrapper = ({ steg, alleSvar, onAnswer }: FormStepProps) => {
  if (!steg) {
    // dette er enten en feil i parseren (klarer ikke å finne neste steg), eller en feil i testregelen.
    return <ErrorMessage>Fann ikkje steg</ErrorMessage>;
  }

  steg = {
    ...steg,
    spm: parseHtmlEntities(steg.spm),
    ht: parseHtmlEntities(steg.ht),
  };

  switch (steg.type) {
    case 'tekst':
      return <TestFormInputText steg={steg} onAnswer={onAnswer} />;
    case 'instruksjon':
      return <TestFormDescription steg={steg} />;
    case 'radio':
    case 'jaNei':
      return (
        <TestFormInputRadio
          steg={steg}
          svar={finnSvar(steg.stegnr, alleSvar)}
          onAnswer={onAnswer}
        />
      );
  }
};
export default TestFormStepWrapper;
