import TestlabStatusTag from '@common/status-badge/TestlabStatusTag';
import { Button, Dropdown, Heading } from '@digdir/designsystemet-react';
import { ArrowDownIcon, CaretDownFillIcon } from '@navikt/aksel-icons';
import {
  elementOmtaleSide,
  ElementResultat,
  findElementOmtale,
  Svar,
} from '@test/api/types';
import SistLagra from '@test/test-overview/loeysing-test/SistLagra';
import TestFormResultat from '@test/testregel-form/TestFormResultat';
import TestFormStepWrapper from '@test/testregel-form/TestFormStepWrapper';
import {
  resultatFromSkjemaMedSvar,
  SkjemaMedSvar,
  TestresultatDetaljer,
} from '@test/testregel-form/types';
import { Testregel } from '@testreglar/api/types';
import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';

import classes from './test-form-accordion.module.css';


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
  const items = useMemo(
    () =>
      skjemaerMedSvar.map((skjemaMedSvar) => ({
        skjemaMedSvar,
        resultatId: skjemaMedSvar.resultatId,
        elementOmtale: findElementOmtale(testregel, skjemaMedSvar.svar),
        detaljer: detaljerMap.get(skjemaMedSvar.resultatId),
      })),
    [skjemaerMedSvar, testregel, detaljerMap]
  );

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

  function dropdownMenu(index: number) {
    return (
      <Dropdown placement="bottom-start" data-size="sm">
        <Dropdown.Trigger data-size="sm" className={classes.copyButton}>
          Kopier svar fra tidligere test
          <CaretDownFillIcon />
        </Dropdown.Trigger>
        <Dropdown.List>
          {items.map(({ skjemaMedSvar, resultatId, elementOmtale }, i) => {
            if (i === index || !elementOmtale) return null;

            return (
              <Dropdown.Item
                key={resultatId}
                onClick={() => kopierSvar(skjemaMedSvar, index)}
              >
                {elementOmtale}
              </Dropdown.Item>
            );
          })}
        </Dropdown.List>
      </Dropdown>
    );
  }

  type AccordionButtonProps = {
    skjemaMedSvar: SkjemaMedSvar;
    resultatId: number;
    elementOmtale: string | undefined;
    kommentar: string | undefined;
    index: number;
  };

  function AccordionButton({
    skjemaMedSvar,
    resultatId,
    elementOmtale,
    kommentar,
    index,
  }: Readonly<AccordionButtonProps>) {
    const resultat = resultatFromSkjemaMedSvar(skjemaMedSvar);
    const label =
      (elementOmtale === elementOmtaleSide && kommentar) || elementOmtale;

    return (
      <button
        className={classes.accordionButton}
        onClick={() => toggleForm(resultatId)}
      >
        <ArrowDownIcon
          className={classNames(classes.arrow, {
            [classes.arrowRotated]: showForm[resultatId],
          })}
        />
        <span className={classes.labelNumber}>
          {elementOmtale ? index + 1 + ': ' : index + 1}
        </span>
        {label}
        <TestlabStatusTag<ElementResultat>
          className={classes.resultat}
          status={resultat}
          colorMapping={{
            danger: ['brot'],
            success: ['samsvar'],
            warning: ['advarsel'],
            info: ['ikkjeForekomst', 'ikkjeTesta'],
          }}
          data-size="md"
        />
      </button>
    );
  }

  function accordionButton(
    skjemaMedSvar: SkjemaMedSvar,
    resultatId: number,
    elementOmtale: string | undefined,
    kommentar: string | undefined,
    index: number
  ) {
    const resultat = resultatFromSkjemaMedSvar(skjemaMedSvar);
    const label =
      (elementOmtale === elementOmtaleSide && kommentar) || elementOmtale;

    return (
      <button
        key={skjemaMedSvar.resultatId}
        className={classes.accordionButton}
        onClick={() => toggleForm(resultatId)}
      >
        <ArrowDownIcon
          className={classNames(classes.arrow, {
            [classes.arrowRotated]: showForm[resultatId],
          })}
        />
        <span className={classes.labelNumber}>
          {elementOmtale ? index + 1 + ': ' : index + 1}
        </span>
        {label}
        <TestlabStatusTag<ElementResultat>
          className={classes.resultat}
          status={resultat}
          colorMapping={{
            danger: ['brot'],
            success: ['samsvar'],
            warning: ['advarsel'],
            info: ['ikkjeForekomst', 'ikkjeTesta'],
          }}
          data-size="md"
        />
      </button>
    );
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
        ({ skjemaMedSvar, resultatId, elementOmtale, detaljer }, index) => (
          <div key={resultatId}>
            <AccordionButton
              skjemaMedSvar={skjemaMedSvar}
              resultatId={resultatId}
              elementOmtale={elementOmtale}
              kommentar={detaljer?.kommentar}
              index={index}
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

                {index !== 0 && dropdownMenu(index)}
                {renderForm(
                  resultatId,
                  skjemaMedSvar,
                  index,
                  elementOmtale,
                  detaljer
                )}
                <div className={classes.accordionFooter}>
                  <Button
                    className={classes.removeButton}
                    variant="secondary"
                    data-size="sm"
                    onClick={() => slettTestelement(resultatId)}
                  >
                    Slett dette testelementet
                  </Button>
                  <SistLagra
                    sistLagra={detaljer?.sistLagra ?? ''}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
