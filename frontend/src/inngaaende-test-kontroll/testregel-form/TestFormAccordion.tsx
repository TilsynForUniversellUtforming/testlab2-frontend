import TestlabStatusTag from '@common/status-badge/TestlabStatusTag';
import { Button, DropdownMenu, Heading } from '@digdir/designsystemet-react';
import { ArrowDownIcon } from '@navikt/aksel-icons';
import { elementOmtaleSide, ElementResultat, findElementOmtale, Svar, } from '@test/api/types';
import TestFormResultat from '@test/testregel-form/TestFormResultat';
import TestFormStepWrapper from '@test/testregel-form/TestFormStepWrapper';
import { resultatFromSkjemaMedSvar, SkjemaMedSvar, } from '@test/testregel-form/types';
import { Testregel } from '@testreglar/api/types';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import classes from './test-form-accordion.module.css';

type Props = {
  testregel: Testregel;
  skjemaerMedSvar: SkjemaMedSvar[];
  onAnswer: (svar: Svar[], index: number) => void;
  onChangeKommentar: (
    resultatId: number,
    kommentar: string | undefined
  ) => void;
  kommentarMap: Map<number, string>;
  slettTestelement: (resultatId: number) => void;
  showHelpText: boolean;
};

export function TestFormAccordion({
  testregel,
  skjemaerMedSvar,
  onAnswer,
  onChangeKommentar,
  kommentarMap,
  slettTestelement,
  showHelpText,
}: Readonly<Props>) {
  function initState() {
    const lastElement = skjemaerMedSvar[skjemaerMedSvar.length - 1];
    return skjemaerMedSvar.reduce(
      (acc, value) => ({ ...acc, [value.resultatId]: value === lastElement }),
      {}
    );
  }

  const [showForm, setShowForm] = useState<Record<number, boolean>>(initState);

  useEffect(() => {
    setShowForm((prevState) => {
      if (Object.entries(prevState).length !== skjemaerMedSvar.length) {
        return initState();
      } else {
        return prevState;
      }
    });
  }, [skjemaerMedSvar]);

  function renderForm(
    resultatId: number,
    skjemaMedSvar: SkjemaMedSvar,
    index: number,
    elementOmtale: string | undefined
  ) {
    const kommentar = kommentarMap.get(resultatId) || '';
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
            kommentar={kommentar}
            resultatId={resultatId}
            isElementSide={isElementSide}
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
      <DropdownMenu placement="bottom-start" size="small">
        <DropdownMenu.Trigger size="small" className={classes.copyButton}>
          Kopier svar fra tidligere test
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {skjemaerMedSvar.map((kilde, i) => {
            if (i === index) return null;

            const elementOmtale = findElementOmtale(testregel, kilde.svar);
            if (!elementOmtale) return null;

            return (
              <DropdownMenu.Item
                key={kilde.resultatId}
                onClick={() => kopierSvar(kilde, index)}
              >
                {elementOmtale}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  }

  function removeElement(resultatId: number) {
    return (
      <Button
        className={classes.removeButton}
        variant="secondary"
        size="small"
        onClick={() => slettTestelement(resultatId)}
      >
        Slett dette testelementet
      </Button>
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
        onClick={() =>
          setShowForm({
            ...showForm,
            [resultatId]: !showForm[resultatId],
          })
        }
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
          size="medium"
        />
      </button>
    );
  }

  if (skjemaerMedSvar.length === 1) {
    const skjemaMedSvar = skjemaerMedSvar[0];
    const resultatId = skjemaMedSvar.resultatId;
    const elementOmtale = findElementOmtale(testregel, skjemaMedSvar.svar);

    return renderForm(resultatId, skjemaMedSvar, 0, elementOmtale);
  } else {
    return (
      <div className={classes.skjemaer}>
        {skjemaerMedSvar.map((skjemaMedSvar, index) => {
          const elementOmtale = findElementOmtale(
            testregel,
            skjemaMedSvar.svar
          );
          const resultatId = skjemaMedSvar.resultatId;
          const kommentar = kommentarMap.get(resultatId);
          return (
            <div key={skjemaMedSvar.resultatId}>
              {accordionButton(
                skjemaMedSvar,
                resultatId,
                elementOmtale,
                kommentar,
                index
              )}
              {showForm[resultatId] && (
                <div className={classes.formContent}>
                  <Heading
                    level={4}
                    size={'medium'}
                    className={classes.formHeading}
                  >
                    Test {index + 1}
                  </Heading>

                  {index !== 0 && dropdownMenu(index)}
                  {renderForm(resultatId, skjemaMedSvar, index, elementOmtale)}
                  {removeElement(resultatId)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
}
