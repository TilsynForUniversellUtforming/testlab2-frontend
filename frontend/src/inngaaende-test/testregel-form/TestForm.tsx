import TestlabDivider from '@common/divider/TestlabDivider';
import { ButtonVariant } from '@common/types';
import { Button, Heading } from '@digdir/design-system-react';
import { Svar } from '@test/api/types';
import { AlleSvar, SkjemaModell } from '@test/util/testregelParser';
import { useEffect, useRef } from 'react';

import TestFormStepWrapper from './TestFormStepWrapper';

interface Props {
  heading: string;
  skjemaModell: SkjemaModell;
  alleSvar: AlleSvar;
  onClickBack: () => void;
  onClickSave: () => void;
  updateResult: (svar: Svar) => void;
}

const TestForm = ({
  heading,
  skjemaModell,
  alleSvar,
  onClickBack,
  onClickSave,
  updateResult,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [skjemaModell]);

  return (
    <div className="test-form" ref={ref}>
      <Heading size="medium" level={3}>
        {heading}
      </Heading>
      <div className="test-form-content">
        {skjemaModell.steg.map((etSteg) => (
          <div key={etSteg.stegnr}>
            <TestFormStepWrapper
              steg={etSteg}
              alleSvar={alleSvar}
              onAnswer={updateResult}
            />
          </div>
        ))}
        {skjemaModell.resultat && (
          <TestFormStepWrapper
            steg={skjemaModell.resultat}
            alleSvar={alleSvar}
            onAnswer={updateResult}
          />
        )}
      </div>
      <TestlabDivider />
      <div className="testregel-form-buttons">
        <Button variant={ButtonVariant.Outline} onClick={onClickBack}>
          Legg til flere testelementer
        </Button>
        <Button onClick={onClickSave}>Lagre og lukk</Button>
      </div>
    </div>
  );
};

export default TestForm;
