import { Accordion } from '@digdir/design-system-react';
import { findElementOmtale, Svar } from '@test/api/types';
import TestFormResultat from '@test/testregel-form/TestFormResultat';
import TestFormStepWrapper from '@test/testregel-form/TestFormStepWrapper';
import { SkjemaMedSvar } from '@test/testregel-form/types';
import { Testregel } from '@testreglar/api/types';

type Props = {
  testregel: Testregel;
  skjemaerMedSvar: SkjemaMedSvar[];
  onAnswer: (svar: Svar, index: number) => void;
};

export function TestFormAccordion({
  testregel,
  skjemaerMedSvar,
  onAnswer,
}: Props) {
  function renderForm(resultatId: number, skjemaMedSvar: SkjemaMedSvar) {
    return (
      <div key={resultatId} className="test-form-content">
        {skjemaMedSvar.skjema.steg.map((etSteg) => (
          <div key={etSteg.stegnr}>
            <TestFormStepWrapper
              steg={etSteg}
              alleSvar={skjemaMedSvar.svar}
              onAnswer={(svar) => onAnswer(svar, 0)}
            />
          </div>
        ))}
        {skjemaMedSvar.skjema.resultat && (
          <TestFormResultat resultat={skjemaMedSvar.skjema.resultat} />
        )}
      </div>
    );
  }

  if (skjemaerMedSvar.length === 1) {
    const skjemaMedSvar = skjemaerMedSvar[0];
    const resultatId = skjemaMedSvar.resultatId;
    return renderForm(resultatId, skjemaMedSvar);
  } else {
    return (
      <Accordion>
        {skjemaerMedSvar.map((skjemaMedSvar, index) => {
          const elementOmtale = findElementOmtale(
            testregel,
            skjemaMedSvar.svar
          );
          const resultatId = skjemaMedSvar.resultatId;
          return (
            <Accordion.Item key={skjemaMedSvar.resultatId} defaultOpen={true}>
              <Accordion.Header>
                {index + 1}
                {elementOmtale && ': ' + elementOmtale}
              </Accordion.Header>
              <Accordion.Content>
                {renderForm(resultatId, skjemaMedSvar)}
              </Accordion.Content>
            </Accordion.Item>
          );
        })}
      </Accordion>
    );
  }
}
