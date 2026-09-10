import { Heading } from '@digdir/designsystemet-react';
import { elementOmtaleSide, Svar } from '@test/api/types';
import SistLagra from '@test/test-overview/loeysing-test/SistLagra';
import TestFormResultat from '@test/testregel-form/TestFormResultat';
import TestFormStepWrapper from '@test/testregel-form/TestFormStepWrapper';
import { SkjemaMedSvar, TestresultatDetaljer, } from '@test/testregel-form/types';
import { Testregel } from '@testreglar/api/types';
import React, { useEffect, useState } from 'react';

import classes from './test-form-accordion.module.css';
import { TestElementFooter } from '@test/testregel-form/TestElementFooter';
import { AccordionButton } from '@test/testregel-form/AccordionButton';
import { useTestFormItems } from '@test/testregel-form/hooks';
import KopierSvarDropdown from '@test/testregel-form/KopierTestDropdown';


type Props = {
  testregel: Testregel;
  skjemaerMedSvar: SkjemaMedSvar[];
  onAnswer: (svar: Svar[], index: number) => void;
  onChangeKommentar: (
    resultatId: number,
    kommentar: string | undefined
  ) => void;
  detaljerMap: Map<number, TestresultatDetaljer>;
  slettTestelement: (resultatId: number) => void;
  showHelpText: boolean;
  isLoading: boolean;
  isDemoApp?: boolean;
};


export function   TestFormAccordion({
  testregel,
  skjemaerMedSvar,
  onAnswer,
  onChangeKommentar,
  detaljerMap,
  slettTestelement,
  showHelpText,
  isLoading,
  isDemoApp,
}: Readonly<Props>) {
  const items = useTestFormItems(skjemaerMedSvar, testregel, detaljerMap);

  function initState() {
    const lastIndex = items.length - 1;
    return items.reduce<Record<number, boolean>>(
      (acc, { resultatId }, index) => ({
        ...acc,
        [resultatId]: index === lastIndex,
      }),
      {}
    );
  }

  const [showForm, setShowForm] = useState<Record<number, boolean>>(initState);

  useEffect(() => {
    setShowForm((prevState) =>
      Object.keys(prevState).length === items.length
        ? prevState
        : initState()
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  function toggleForm(resultatId: number) {
    setShowForm((prevState) => ({
      ...prevState,
      [resultatId]: !prevState[resultatId],
    }));
  }

  function renderForm(
    resultatId: number,
    skjemaMedSvar: SkjemaMedSvar,
    index: number,
    elementOmtale: string | undefined,
    detaljer: TestresultatDetaljer | undefined
  ) {
    const isElementSide = elementOmtale === elementOmtaleSide;

    return (
      <div key={resultatId} className={classes.form}>
        {skjemaMedSvar.skjema.steg.map((etSteg) => (
          <div key={etSteg.stegnr}>
            <TestFormStepWrapper
              steg={etSteg}
              alleSvar={skjemaMedSvar.svar}
              index={index}
              onAnswer={(svar) => onAnswer([svar], index)}
              showHelpText={showHelpText}
            />
          </div>
        ))}
        {skjemaMedSvar.skjema.resultat && (
          <TestFormResultat
            resultat={skjemaMedSvar.skjema.resultat}
            onChangeKommentar={onChangeKommentar}
            kommentar={detaljer?.kommentar ?? ''}
            resultatId={resultatId}
            isElementSide={isElementSide}
            isDemoApp={isDemoApp}
          />
        )}
      </div>
    );
  }

  function kopierSvar(kilde: SkjemaMedSvar, index: number) {
    onAnswer(kilde.svar, index);
  }




  if (items.length === 1) {
    const { skjemaMedSvar, resultatId, elementOmtale, detaljer } = items[0];

    return (
      <>
        {renderForm(resultatId, skjemaMedSvar, 0, elementOmtale, detaljer)}
        <SistLagra sistLagra={detaljer?.sistLagra ?? ''} isLoading={isLoading} />
      </>
    );
  }

  return (
    <div className={classes.skjemaer}>
      {items.map(
        ({ skjemaMedSvar, resultatId, elementOmtale, detaljer }, index) => {
          return (
            <div key={resultatId}>
              <AccordionButton
                skjemaMedSvar={skjemaMedSvar}
                resultatId={resultatId}
                elementOmtale={elementOmtale}
                kommentar={detaljer?.kommentar}
                index={index}
                showForm={showForm}
                toggleForm={toggleForm}
              />
              {showForm[resultatId] && (
                <div className={classes.formContent}>
                  <Heading
                    level={4}
                    data-size={'md'}
                    className={classes.formHeading}
                  >
                    Test {index + 1}
                  </Heading>
                  {index !== 0 && <KopierSvarDropdown index={index} items={items} kopierSvar={kopierSvar} />}
                  {renderForm(
                    resultatId,
                    skjemaMedSvar,
                    index,
                    elementOmtale,
                    detaljer
                  )}
                  {
                    <TestElementFooter
                      slettTestelement={slettTestelement}
                      resultatId={resultatId}
                      sistLagra={detaljer?.sistLagra}
                      isLoading={isLoading}
                    />
                  }
                </div>
              )}
            </div>
          );}
      )}
    </div>
  );
}
