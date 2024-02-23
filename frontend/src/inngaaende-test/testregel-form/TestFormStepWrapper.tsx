import { parseHtmlEntities } from '@common/util/stringutils';
import { ErrorMessage } from '@digdir/design-system-react';
import { Svar } from '@test/api/types';
import TestFormDescription from '@test/testregel-form/input/TestFormDescription';
import TestFormInputRadio from '@test/testregel-form/input/TestFormInputRadio';
import TestFormInputText from '@test/testregel-form/input/TestFormInputText';
import { Steg } from '@test/util/testregel-interface/Steg';
import { finnSvar } from '@test/util/testregelParser';

interface FormStepProps {
  steg: Steg | undefined;
  alleSvar: Svar[];
  onAnswer: (answer: Svar) => void;
  showHelpText: boolean;
}

const TestFormStepWrapper = ({
  steg,
  alleSvar,
  onAnswer,
  showHelpText,
}: FormStepProps) => {
  if (!steg) {
    // dette er enten en feil i parseren (klarer ikke å finne neste steg), eller en feil i testregelen.
    return <ErrorMessage>Fann ikkje steg</ErrorMessage>;
  }

  steg = {
    ...steg,
    spm: parseHtmlEntities(steg.spm),
    ht: showHelpText ? parseHtmlEntities(steg.ht) : '',
  };

  switch (steg.type) {
    case 'tekst':
      return (
        <TestFormInputText
          steg={steg}
          svar={finnSvar(steg.stegnr, alleSvar)}
          onAnswer={onAnswer}
        />
      );
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
