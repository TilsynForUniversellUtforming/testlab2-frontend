import TestlabDivider from '@common/divider/TestlabDivider';
import { ButtonVariant } from '@common/types';
import { takeWhile } from '@common/util/arrayUtils';
import { Button, Heading } from '@digdir/design-system-react';
import { Svar } from '@test/api/types';
import { SkjemaOgSvar } from '@test/testregel-form/types';
import {
  AlleSvar,
  finnSvar,
  lagSkjemaModell,
  Resultat,
} from '@test/util/testregelParser';
import { Testregel } from '@testreglar/api/types';
import { useEffect, useRef, useState } from 'react';

import TestFormStepWrapper from './TestFormStepWrapper';

interface Props {
  testregel: Testregel;
  onClickBack: () => void;
  onClickSave: () => void;
  onResultat: (
    resultat: Resultat,
    elementOmtale: string,
    svar: AlleSvar
  ) => void;
}

const TestForm = ({
  testregel,
  onClickBack,
  onClickSave,
  onResultat,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [skjemaOgSvar, setSkjemaOgSvar] = useState<SkjemaOgSvar>({
    skjemaModell: lagSkjemaModell(testregel.testregelSchema, []),
    alleSvar: [],
  });

  const { skjemaModell, alleSvar } = skjemaOgSvar;

  function onAnswer(nyttSvar: Svar) {
    setSkjemaOgSvar((prevState) => {
      const oppdaterteSvar = takeWhile(
        prevState.alleSvar,
        (svar) => svar.steg !== nyttSvar.steg
      ).concat([nyttSvar]);
      const oppdatertSkjemaModell = lagSkjemaModell(
        testregel.testregelSchema,
        oppdaterteSvar
      );
      return {
        ...prevState,
        skjemaModell: oppdatertSkjemaModell,
        alleSvar: oppdaterteSvar,
      };
    });
  }

  useEffect(() => {
    ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [skjemaModell]);

  useEffect(() => {
    if (skjemaModell.resultat) {
      const element = JSON.parse(testregel.testregelSchema).element;
      const elementOmtale =
        finnSvar(element, alleSvar) ?? 'Finn ikkje elementomtala';

      onResultat(skjemaModell.resultat, elementOmtale, alleSvar);
    }
  }, [skjemaModell]);

  return (
    <div className="test-form" ref={ref}>
      <Heading size="medium" level={3}>
        {testregel.name}
      </Heading>
      <div className="test-form-content">
        {skjemaModell.steg.map((etSteg) => (
          <div key={etSteg.stegnr}>
            <TestFormStepWrapper
              steg={etSteg}
              alleSvar={alleSvar}
              onAnswer={onAnswer}
            />
          </div>
        ))}
        {skjemaModell.resultat && (
          <TestFormStepWrapper
            steg={skjemaModell.resultat}
            alleSvar={alleSvar}
            onAnswer={onAnswer}
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
