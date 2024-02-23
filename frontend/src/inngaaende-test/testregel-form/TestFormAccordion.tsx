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
  showHelpText: boolean;
};

export function TestFormAccordion({
  testregel,
  skjemaerMedSvar,
  onAnswer,
  showHelpText,
}: Readonly<Props>) {
  function renderForm(
    resultatId: number,
    skjemaMedSvar: SkjemaMedSvar,
    index: number
  ) {
    return (
      <div key={resultatId} className="test-form-content">
        {skjemaMedSvar.skjema.steg.map((etSteg) => (
          <div key={etSteg.stegnr}>
            <TestFormStepWrapper
              steg={etSteg}
              alleSvar={skjemaMedSvar.svar}
              index={index}
              onAnswer={(svar) => onAnswer(svar, index)}
              showHelpText={showHelpText}
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
    return renderForm(resultatId, skjemaMedSvar, 0);
  } else {
    return (
      <Accordion>
        {skjemaerMedSvar.map((skjemaMedSvar, index) => {
          const elementOmtale = findElementOmtale(
            testregel,
            skjemaMedSvar.svar
          );
          const resultatId = skjemaMedSvar.resultatId;
          const isLast = index === skjemaerMedSvar.length - 1;
          return (
            <Accordion.Item key={skjemaMedSvar.resultatId} defaultOpen={isLast}>
              <Accordion.Header>
                {index + 1}
                {elementOmtale && ': ' + elementOmtale}
              </Accordion.Header>
              <Accordion.Content>
                {renderForm(resultatId, skjemaMedSvar, index)}
              </Accordion.Content>
            </Accordion.Item>
          );
        })}
      </Accordion>
    );
  }
}
