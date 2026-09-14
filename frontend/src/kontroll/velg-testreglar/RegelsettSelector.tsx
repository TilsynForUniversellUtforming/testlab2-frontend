import { Alert, Button, Dialog, Heading, Paragraph } from '@digdir/designsystemet-react';
import { Regelsett, TestregelModus } from '@testreglar/api/types';
import classNames from 'classnames';

import classes from '../kontroll.module.css';
import { InformationIcon } from '@navikt/aksel-icons';
import React from 'react';

interface Props {
  regelsettList: Regelsett[];
  selectedRegelsettId: number | undefined;
  onSelectRegelsett: (regelsettId: number) => void;
  isInngaaende: boolean;
  isForenkla: boolean;
  modus: TestregelModus;
}

const RegelsettSelector = ({
  onSelectRegelsett,
  selectedRegelsettId,
  regelsettList,
  isForenkla,
  modus,
}: Props) => {
  if (isForenkla && modus !== 'automatisk') {
    return (
      <Alert data-color="warning">
        Kombinasjon av automatiske og manuelle testreglar er ikkje mogleg ennå
      </Alert>
    );
  }

  if (regelsettList.length === 0) {
    return (
      <Alert data-color="info">Ingen regelsett for valgt type tilgjengelig</Alert>
    );
  }

  return (
    <ul className={classes.velgRegelsettButtons}>
      {regelsettList.map((regelsett) => (
        <li key={regelsett.id} className={classes.utvalgPreviewWrapper}>
          <Button
            onClick={() => onSelectRegelsett(regelsett.id)}
            className={classNames(classes.utvalgValgButton, {
              [classes.selected]: regelsett.id === selectedRegelsettId,
            })}
          >
            {regelsett.namn}
          </Button>
          <Button
            className={classes.utvalgPreviewTrigger}
            command="show-modal"
            commandfor={`utval-preview-modal-${regelsett.id}`}
            data-utvalid={regelsett.id}
            data-variant={'secondary'}
            icon
          >
            <InformationIcon title="a11y-title" fontSize="1.5rem" />
          </Button>
          <Dialog id={`utval-preview-modal-${regelsett.id}`}>
            <Heading style={{ marginBottom: 'var(--ds-size-2)' }}>
              Testreglar i utval: {regelsett.namn}
            </Heading>
            <Paragraph style={{ marginBottom: 'var(--ds-size-2)' }}>
              <ul>
                {regelsett.testregelList.map((testregel) => {
                  return <li key={testregel.id}>{testregel.namn}</li>;
                })}
              </ul>
            </Paragraph>
          </Dialog>
        </li>
      ))}
    </ul>
  );
};

export default RegelsettSelector;
