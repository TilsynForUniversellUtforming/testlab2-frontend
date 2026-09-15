import { Utval } from '@utval/types';
import classes from '../kontroll.module.css';
import classNames from 'classnames';
import { Button, Dialog, Heading, Paragraph } from '@digdir/designsystemet-react';
import { InformationIcon } from '@navikt/aksel-icons';
import React from 'react';
import { formatDate } from '@common/util/stringutils';


type Props = {
  utval: Utval;
  velgUtval: (utval: Utval) => void;
  isValgt: boolean;
};

export const UtvalDetailButton = ({utval,velgUtval,isValgt}:Props) => {
  return (
    <li className={classes.utvalgPreviewWrapper}>
      <Button
        data-testid="utvalg"
        onClick={() => velgUtval(utval)}
        className={classNames(classes.utvalgValgButton, {
          [classes.selected]: isValgt,
        })}
      >
        <span className={classes.utvalgNamn}>{utval.namn}</span>
        <span className={classes.utvalgOppretta}>
          {formatDate(utval.oppretta)}
        </span>
      </Button>
      <Button
        className={classes.utvalgPreviewTrigger}
        command="show-modal"
        commandfor={`utval-preview-modal-${utval.id}`}
        data-utvalid={utval.id}
        data-variant={'secondary'}
        icon
      >
        <InformationIcon title="a11y-title" fontSize="1.5rem" />
      </Button>
      <Dialog id={`utval-preview-modal-${utval.id}`}>
        <Heading style={{ marginBottom: 'var(--ds-size-2)' }}>
          Løysingar i utval: {utval.namn}
        </Heading>
        <ul style={{ marginBottom: 'var(--ds-size-2)' }}>
          {utval.loeysingar.map((loeysing) => {
            return <li key={loeysing.id}>{loeysing.namn}</li>;
          })}
        </ul>
      </Dialog>
    </li>
  );
}